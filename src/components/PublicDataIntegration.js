// Public playground for creating maps (no sign-in). Uses DataIntegration with isPlayground.
// No Sidebar; HomeHeader is rendered inside DataIntegration when isPlayground is true.

import React from "react";
import DataIntegration from "./DataIntergration";

export default function PublicDataIntegration() {
  return <DataIntegration isPlayground />;
}
