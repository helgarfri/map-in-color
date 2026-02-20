// Public playground for creating maps (no sign-in). Uses DataIntegration with isPlayground.
// Rendered under PublicLayout (which provides HomeHeader) so we hide the duplicate header.

import React from "react";
import DataIntegration from "./DataIntergration";

export default function PublicDataIntegration() {
  return <DataIntegration isPlayground hideHeader />;
}
