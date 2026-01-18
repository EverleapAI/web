// src/app/main/explore/renderers/index.tsx
"use client";

import type { ComponentType } from "react";

import type { ExploreChipType, ExploreRendererProps } from "../content/types";

import CareersRenderer from "./CareersRenderer";
import EducationRenderer from "./EducationRenderer";
import TravelRenderer from "./TravelRenderer";
import CommunityRenderer from "./CommunityRenderer";
import HobbiesRenderer from "./HobbiesRenderer";

/**
 * Renderer registry
 * - Keeps Explore self-contained
 * - Enforces: every ExploreChipType has a renderer
 */
export const RENDERERS: Record<
  ExploreChipType,
  ComponentType<ExploreRendererProps>
> = {
  careers: CareersRenderer,
  education: EducationRenderer,
  travel: TravelRenderer,
  community: CommunityRenderer,
  hobbies: HobbiesRenderer,
};
