/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Wizard } from './components/Wizard';

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-[#f5f5f5] selection:bg-black selection:text-white">
      <Wizard />
    </div>
  );
}