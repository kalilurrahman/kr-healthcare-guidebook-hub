import { HealthcareHeader } from "@/components/HealthcareHeader";
import { HeroSection } from "@/components/HeroSection";
import { AboutHandbook } from "@/components/AboutHandbook";
import { StrategicChaptersGrid } from "@/components/StrategicChaptersGrid";
import { RCMPlaybookTabs } from "@/components/RCMPlaybookTabs";
import { OnlineReaderPlaceholder } from "@/components/OnlineReaderPlaceholder";
import { AboutKR } from "@/components/AboutKR";
import { HealthcareFooter } from "@/components/HealthcareFooter";
import { InstallPrompt } from "@/components/InstallPrompt";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HealthcareHeader />
      <HeroSection />
      <div id="about-handbook">
        <AboutHandbook />
      </div>
      <StrategicChaptersGrid />
      <RCMPlaybookTabs />
      <OnlineReaderPlaceholder />
      <AboutKR />
      <HealthcareFooter />
      <InstallPrompt />
    </div>
  );
};

export default Index;
