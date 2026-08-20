import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Focus from './components/Focus'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Research from './components/Research'
import Experience from './components/Experience'
import Achievements from './components/Achievements'
import Awaaz from './components/Awaaz'
import Leadership from './components/Leadership'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="bg-ink text-text min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Focus />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Research />
        <Achievements />
        <Awaaz />
        <Leadership />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
