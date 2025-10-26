'use client';

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Zap,
  Target,
  Eye,
  Keyboard,
  BookOpen,
  Split,
  Music,
  Grid3X3,
  Hash,
  MessageSquare,
  User,
  TrendingUp,
  Award,
  Activity,
} from "lucide-react";

interface TestCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  isNew: boolean;
  category: string;
}

const iconMap: { [key: string]: LucideIcon } = {
  Brain,
  Zap,
  Target,
  Eye,
  Keyboard,
  BookOpen,
  Split,
  Music,
  Grid3X3,
  Hash,
  MessageSquare,
  User,
  TrendingUp,
  Award,
  Activity,
};

const TestCard: React.FC<TestCardProps> = ({ id, title, description, icon, color, bgColor, isNew, category }) => {
  const IconComponent = iconMap[icon];

  if (!IconComponent) {
    console.warn(`Icon component not found for: ${icon}`);
    return null; // Or render a fallback icon
  }

  return (
    <Link key={id} href={`/tests/${id}`}>
      <Card className="neural-card h-full cursor-pointer group border-0 rounded-2xl overflow-hidden">
        <CardHeader className="text-center pb-3 sm:pb-4 relative">
          <div className="relative mb-3 sm:mb-4">
            <div
              className={`${bgColor} w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}
            >
              <IconComponent className={`w-7 h-7 sm:w-8 sm:h-8 ${color}`} />
            </div>
            {isNew && (
              <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-violet-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                NEW
              </Badge>
            )}
            <Badge variant="secondary" className="absolute -top-2 -left-2 text-xs font-medium">
              {category}
            </Badge>
          </div>
          <CardTitle className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors font-mono">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <CardDescription className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
            {description}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
};

export default TestCard;
