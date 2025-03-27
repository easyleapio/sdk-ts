import { DemoSection } from "@/components/demo-section";
import Hero from "@/components/hero";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import Navbar from "@/components/navbar";

function App() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#211D31] font-dmSans">
      <img
        src="/hero/bg-grid-pattern.svg"
        className="pointer-events-none absolute right-0 top-0 z-0 select-none"
        alt="bg-grid-pattern"
      />

      <Navbar />

      <MaxWidthWrapper>
        <Hero />
        <DemoSection />
      </MaxWidthWrapper>
    </div>
  );
}

export default App;
