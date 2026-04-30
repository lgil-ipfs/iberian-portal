import { currentUser } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default async function EducationPage() {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  const firstName = user.firstName || user.emailAddresses[0].emailAddress.split('@')[0]

  return (
    <div className="portal-root" style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      
      {/* 1. TOPBAR */}
      <div style={{ background: 'var(--maroon)', color: 'rgba(255,255,255,0.9)', fontSize: '13px', height: 'var(--nav-top-h)', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ fontWeight: 500, letterSpacing: '0.02em' }}>
            Private Client Portal
          </div>
          <div style={{ display: 'flex', gap: '20px', fontWeight: 600 }}>
            <a href="https://iberianpacific.ca/contact" style={{ color: 'inherit' }}>Support</a>
            <a href="https://iberianpacific.ca/services" style={{ color: 'inherit' }}>Services</a>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAV */}
      <header style={{ background: 'var(--charcoal)', height: 'var(--nav-h)', display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img 
              src="https://cdn.prod.website-files.com/68ed2588f300fc2737bceebf/68ed30864b7c7327a36e3c8b_IPFS-Logo-c.svg" 
              alt="Iberian Pacific" 
              style={{ height: '36px' }} 
            />
            <span style={{ fontFamily: 'var(--font-display)', color: 'var(--white)', fontSize: '22px', fontWeight: 700, letterSpacing: '0.04em' }}>
              Iberian Pacific
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
            <nav style={{ display: 'flex', gap: '25px', color: 'rgba(255,255,255,0.85)', fontSize: '14px', fontWeight: 500 }}>
              <a href="/dashboard" style={{ color: 'inherit' }}>Overview</a>
              <a href="/education" style={{ color: 'var(--white)', borderBottom: '2px solid var(--gold)', paddingBottom: '4px' }}>Education</a>
              <a href="https://iberianpacific.ca/insights" style={{ color: 'inherit' }}>Insights</a>
            </nav>
            <div style={{ paddingLeft: '15px', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      {/* 3. EDUCATION BODY */}
      <main className="container" style={{ padding: '4rem 24px' }}>
        
        {/* Welcome Section */}
        <section style={{ marginBottom: '5rem' }}>
          <div className="kicker" style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '13px', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '30px', height: '2px', background: 'linear-gradient(90deg, var(--gold), transparent)' }}></span>
            Client Resource Center
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: 'var(--maroon-deep)', marginBottom: '1.5rem', fontWeight: 700 }}>
            Knowledge is <span style={{ fontStyle: 'italic', fontWeight: 400 }}>Your Asset.</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#555', maxWidth: '700px', lineHeight: 1.6, fontWeight: 300 }}>
            Explore our curated library of financial education, strategy breakdowns, and planning courses designed specifically for our private clients.
          </p>
        </section>

        {/* 4. FEATURED COURSES */}
        <section style={{ marginBottom: '4.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '28px', color: 'var(--maroon-deep)', margin: 0 }}>Strategic Courses</h2>
            <div style={{ flex: 1, height: '1px', background: 'rgba(107, 39, 55, 0.1)' }}></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '30px' }}>
            {[
              { title: 'The Mortgage Freedom Framework', length: '4 Modules', level: 'Intermediate', desc: 'A step-by-step guide to coordinating debt reduction with tax-efficient investing.' },
              { title: 'Incorporated Professional Wealth', length: '6 Modules', level: 'Advanced', desc: 'Strategies for managing retained earnings and tax-efficient corporate distributions.' },
            ].map((course) => (
              <div key={course.title} className="card" style={{ display: 'flex', overflow: 'hidden', minHeight: '200px' }}>
                <div style={{ width: '120px', background: 'var(--maroon-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontSize: '40px' }}>
                  <i className="fa-solid fa-graduation-cap"></i>
                </div>
                <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Course &middot; {course.length}
                  </div>
                  <h3 style={{ fontSize: '20px', color: 'var(--maroon)', marginBottom: '10px' }}>{course.title}</h3>
                  <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.5, marginBottom: '1.5rem', flex: 1 }}>{course.desc}</p>
                  <a href="#" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '12px', alignSelf: 'flex-start' }}>Start Learning</a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. ARTICLES & VIDEOS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
          
          {/* Latest Articles */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '24px', color: 'var(--maroon-deep)', margin: 0 }}>Strategy Articles</h2>
              <div style={{ flex: 1, height: '1px', background: 'rgba(107, 39, 55, 0.1)' }}></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { title: 'Tax Efficiency in High Interest Environments', date: 'April 2026', tag: 'Tax Strategy' },
                { title: 'Understanding the New FHSA Contribution Rules', date: 'March 2026', tag: 'Real Estate' },
                { title: 'Legacy Planning for Business Owners', date: 'February 2026', tag: 'Estate' },
              ].map((article) => (
                <div key={article.title} className="card" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>{article.tag}</div>
                    <h3 style={{ fontSize: '18px', color: 'var(--maroon)', margin: 0 }}>{article.title}</h3>
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>Published {article.date}</div>
                  </div>
                  <a href="#" style={{ color: 'var(--maroon)', fontWeight: 600, fontSize: '14px' }}>Read More &rarr;</a>
                </div>
              ))}
            </div>
          </section>

          {/* Video Lessons */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '24px', color: 'var(--maroon-deep)', margin: 0 }}>Video Lessons</h2>
              <div style={{ flex: 1, height: '1px', background: 'rgba(107, 39, 55, 0.1)' }}></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { title: 'Quarterly Market Commentary', duration: '12:45' },
                { title: 'How to Read Your Monarch Statement', duration: '05:20' },
              ].map((video) => (
                <div key={video.title} className="card" style={{ overflow: 'hidden' }}>
                  <div style={{ aspectRatio: '16/9', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '32px' }}>
                    <i className="fa-solid fa-play"></i>
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '16px', color: 'var(--maroon)', margin: '0 0 4px 0' }}>{video.title}</h3>
                    <div style={{ fontSize: '12px', color: '#999' }}>Duration: {video.duration}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

      </main>

      {/* FOOTER */}
      <footer style={{ background: 'var(--charcoal)', color: 'rgba(255,255,255,0.6)', padding: '4rem 0', borderTop: '4px solid var(--gold)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img 
                src="https://cdn.prod.website-files.com/68ed2588f300fc2737bceebf/68ed30864b7c7327a36e3c8b_IPFS-Logo-c.svg" 
                alt="Iberian Pacific" 
                style={{ height: '32px', filter: 'brightness(0) invert(1)', opacity: 0.8 }} 
              />
              <span style={{ fontFamily: 'var(--font-display)', color: 'var(--white)', fontSize: '20px', fontWeight: 600 }}>Iberian Pacific</span>
            </div>
            <div style={{ display: 'flex', gap: '30px', fontSize: '14px' }}>
              <a href="https://iberianpacific.ca/privacy" style={{ color: 'inherit' }}>Privacy Policy</a>
              <a href="https://iberianpacific.ca/terms" style={{ color: 'inherit' }}>Terms of Service</a>
              <a href="https://iberianpacific.ca/disclaimers" style={{ color: 'inherit' }}>Disclaimers</a>
            </div>
          </div>
          <div style={{ fontSize: '13px', lineHeight: 1.8 }}>
            <p>Mutual funds are offered through Monarch Wealth Corporation. Insurance distributed through Customplan Financial Advisors Inc. Serving BC and Ontario.</p>
            <p style={{ marginTop: '1rem' }}>&copy; {new Date().getFullYear()} Iberian Pacific Financial Services. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
