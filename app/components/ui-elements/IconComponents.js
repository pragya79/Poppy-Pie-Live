'use client';

import { 
  MessageSquare, 
  Users, 
  Layout, 
  Zap, 
  PenTool, 
  Coffee, 
  Globe, 
  FileText, 
  TrendingUp, 
  ExternalLink
} from 'lucide-react';

const IconComponents = {
  MessageSquare: () => <MessageSquare size={18} className="flex-shrink-0" />,
  Users: () => <Users size={18} className="flex-shrink-0" />,
  Layout: () => <Layout size={18} className="flex-shrink-0" />,
  Zap: () => <Zap size={16} className="flex-shrink-0" />,
  PenTool: () => <PenTool size={18} className="flex-shrink-0" />,
  Coffee: () => <Coffee size={16} className="flex-shrink-0" />,
  Globe: () => <Globe size={16} className="flex-shrink-0" />,
  FileText: () => <FileText size={16} className="flex-shrink-0" />,
  TrendingUp: () => <TrendingUp size={16} className="flex-shrink-0" />,
  ExternalLink: () => <ExternalLink size={16} className="flex-shrink-0" />
};

export default IconComponents;