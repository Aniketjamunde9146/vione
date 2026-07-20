import DirectEnquiry from "./enquiry/DirectEnquiry";
import BlogSection from "./blogs/page";
import ExploreFurther from "./sections/explore/page";
import HeroPage from "./sections/hero/page";
import ExperienceTwoPage from "./sections/experience/page";
import GlimpseTwoPage from "./sections/glimps/page";


export default function Home() {
  return (
    <main>
      <HeroPage />
      <ExperienceTwoPage />
      <GlimpseTwoPage />
      <BlogSection />
      <ExploreFurther />
      <DirectEnquiry />
      
    </main>
  );
}