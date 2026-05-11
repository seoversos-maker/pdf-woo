<?php
/**
 * Plugin Name: PDF Woo Bridge
 * Description: Puente robusto con soporte CORS para conectar WooCommerce con el Generador de Catálogos PDF.
 * Version: 1.1.0
 * Author: Antigravity Architect
 */

if ( ! defined( 'ABSPATH' ) ) exit;

class PDF_Woo_Bridge {
    private $token_option = 'pdf_woo_bridge_token';

    public function __construct() {
        add_action( 'rest_api_init', array( $this, 'register_routes' ) );
        add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
        
        // Agregar headers de CORS globalmente para la REST API
        add_action( 'rest_api_init', function() {
            remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );
            add_filter( 'rest_pre_serve_request', function( $value ) {
                header( 'Access-Control-Allow-Origin: *' );
                header( 'Access-Control-Allow-Methods: GET' );
                header( 'Access-Control-Allow-Credentials: true' );
                header( 'Access-Control-Expose-Headers: Link', false );
                header( 'Access-Control-Allow-Headers: X-PDF-Woo-Token, Content-Type, Authorization' );
                return $value;
            } );
        }, 15 );

        // Intentar habilitar CORS para imágenes vía .htaccess al activar
        register_activation_hook( __FILE__, array( $this, 'activate' ) );
    }

    public function activate() {
        $this->add_cors_to_htaccess();
    }

    private $htaccess_marker = '# BEGIN PDF WOO CORS';
    private $htaccess_end_marker = '# END PDF WOO CORS';

    public function add_cors_to_htaccess() {
        $htaccess_path = ABSPATH . '.htaccess';
        if ( is_writable( $htaccess_path ) ) {
            $content = file_get_contents( $htaccess_path );
            
            // Si ya existe el bloque, no hacemos nada
            if ( strpos( $content, $this->htaccess_marker ) !== false ) {
                return;
            }

            $cors_rules = "\n" . $this->htaccess_marker . "\n" .
                          "<IfModule mod_headers.c>\n" .
                          "    Header set Access-Control-Allow-Origin \"*\"\n" .
                          "</IfModule>\n" .
                          $this->htaccess_end_marker . "\n";
            
            file_put_contents( $htaccess_path, $content . $cors_rules );
        }
    }

    public function register_routes() {
        register_rest_route( 'pdf-woo/v1', '/categories', array(
            'methods' => 'GET',
            'callback' => array( $this, 'get_categories' ),
            'permission_callback' => array( $this, 'check_token' )
        ) );

        register_rest_route( 'pdf-woo/v1', '/products', array(
            'methods' => 'GET',
            'callback' => array( $this, 'get_products' ),
            'permission_callback' => array( $this, 'check_token' )
        ) );
    }

    public function check_token( $request ) {
        $token = $request->get_header( 'X-PDF-Woo-Token' );
        $saved_token = get_option( $this->token_option );
        return ( $token && $token === $saved_token );
    }

    public function get_categories() {
        $categories = get_terms( array(
            'taxonomy' => 'product_cat',
            'hide_empty' => false,
        ) );

        return array_map( function( $cat ) {
            return array(
                'id' => $cat->term_id,
                'name' => htmlspecialchars_decode($cat->name),
                'count' => $cat->count,
                'parent' => $cat->parent
            );
        }, $categories );
    }

    public function get_products( $request ) {
        $category_ids = $request->get_param( 'category' );
        $args = array(
            'post_type' => 'product',
            'posts_per_page' => -1,
            'post_status' => 'publish',
        );

        if ( $category_ids ) {
            $args['tax_query'] = array(
                array(
                    'taxonomy' => 'product_cat',
                    'field'    => 'term_id',
                    'terms'    => explode( ',', $category_ids ),
                ),
            );
        }

        $products = get_posts( $args );
        return array_map( function( $post ) {
            $product = wc_get_product( $post->ID );
            return array(
                'id' => $post->ID,
                'name' => $post->post_title,
                'price' => $product->get_price(),
                'sku' => $product->get_sku(),
                'images' => array( array( 'src' => wp_get_attachment_url( $product->get_image_id() ) ) ),
                'stock_status' => $product->get_stock_status()
            );
        }, $products );
    }

    public function add_admin_menu() {
        add_submenu_page(
            'woocommerce',
            'PDF Woo Bridge',
            'PDF Woo Bridge',
            'manage_options',
            'pdf-woo-bridge',
            array( $this, 'settings_page' )
        );
    }

    public function settings_page() {
        if ( isset( $_POST['generate_token'] ) ) {
            update_option( $this->token_option, bin2hex( random_bytes( 16 ) ) );
        }
        if ( isset( $_POST['fix_htaccess'] ) ) {
            $this->add_cors_to_htaccess();
            echo '<div class="updated"><p>Reglas CORS agregadas al .htaccess</p></div>';
        }
        $token = get_option( $this->token_option );
        ?>
        <div class="wrap">
            <h1>PDF Woo Bridge</h1>
            <p>Configuración para conexión robusta y bypass de CORS.</p>
            <table class="form-table">
                <tr>
                    <th scope="row">Tu Token de Acceso:</th>
                    <td>
                        <code style="background: #eee; padding: 10px; display: inline-block; border-radius: 4px; font-size: 1.2em;">
                            <?php echo $token ? $token : 'No generado'; ?>
                        </code>
                    </td>
                </tr>
            </table>
            <form method="post" style="display:inline-block; margin-right: 10px;">
                <input type="submit" name="generate_token" class="button button-primary" value="Generar Nuevo Token">
            </form>
            <form method="post" style="display:inline-block;">
                <input type="submit" name="fix_htaccess" class="button" value="Reparar .htaccess (Fix CORS)">
            </form>
        </div>
        <?php
    }
}

new PDF_Woo_Bridge();
