import DirectEnquiry from "./enquiry/DirectEnquiry";
import BlogSection from "./blogs/page";
import ExploreFurther from "./sections/explore/page";
import HallOnePage from "./sections/hallone/page";
import HallTwoPage from "./sections/halltwo/page";
import HeroPage from "./sections/hero/page";


export default function Home() {
  return (
    <main>
      <HeroPage />
      <HallOnePage />
      <HallTwoPage />
      <BlogSection />
      <ExploreFurther />
      <DirectEnquiry />
      
    </main>
  );
}