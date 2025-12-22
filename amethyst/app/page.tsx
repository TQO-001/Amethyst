import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Editor from '@/components/Editor';
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