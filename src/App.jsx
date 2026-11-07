import { LazyMotion, domAnimation } from 'motion/react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Projects from './components/Projects.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  // domAnimation covers animate/exit/variants/hover/inView; `strict` throws
  // if a full `motion.*` component sneaks back in and defeats the split.
  return (
    <LazyMotion features={domAnimation} strict>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Projects />
        <About />
        <Contact />
      </main>
      <Footer />
    </LazyMotion>
  );
}
