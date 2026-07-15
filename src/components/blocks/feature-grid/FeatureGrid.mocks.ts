import { Zap, Shield, Globe, BarChart3, Users, Bell } from "lucide-react";
import type { FeatureGridProps } from "./FeatureGrid.types";

export const mockFeatures = [
  {
    icon: Zap,
    heading: "Lightning Fast",
    description:
      "Built on Next.js for optimal performance with automatic code splitting and edge caching.",
  },
  {
    icon: Shield,
    heading: "Secure by Default",
    description:
      "Enterprise-grade security with CSP headers, proper CORS configuration, and input validation.",
  },
  {
    icon: Globe,
    heading: "International Ready",
    description:
      "Full i18n support with next-intl for routing, translations, and locale detection out of the box.",
  },
  {
    icon: BarChart3,
    heading: "Analytics Ready",
    description:
      "Event tracking infrastructure built in. Drop in your analytics provider with zero friction.",
  },
  {
    icon: Users,
    heading: "Team Friendly",
    description:
      "Consistent code patterns, co-located files, and strong conventions make collaboration easy.",
  },
  {
    icon: Bell,
    heading: "Notification System",
    description:
      "Toast notifications and banner alerts with action callbacks and auto-dismiss timing.",
  },
];

export const mockFeatureGridProps: FeatureGridProps = {
  heading: "Everything You Need",
  description:
    "Production-grade features to build and scale your marketing site.",
  features: mockFeatures,
  columns: 3,
};

export const mockFeatureGridTwoColumns: FeatureGridProps = {
  ...mockFeatureGridProps,
  columns: 2,
  features: mockFeatures.slice(0, 4),
};

export const mockFeatureGridFourColumns: FeatureGridProps = {
  ...mockFeatureGridProps,
  columns: 4,
  features: mockFeatures.slice(0, 4),
};
