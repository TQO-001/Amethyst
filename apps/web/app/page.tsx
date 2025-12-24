import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import Editor from '@/components/editor/Editor';
import SplashCursor from '@/components/SplashCursor' // Adjust based on actual filename

export default function Home() {
  return (
    <>
      <NavBar />
      <SplashCursor />
      <Editor />
      <Footer />
    </>
  );
}