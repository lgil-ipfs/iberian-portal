import { currentUser } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'
import { redirect, notFound } from 'next/navigation'
import {
  INSURANCE_PLACEHOLDERS,
  STAGES,
  getStageIndex,
  type InsurancePlan,
  type RequirementItem,
  type RequirementStatus,
} from '@/data/insurance'

type Props = {
  params: Promise<{ policyId: string }>
}

function statusBadge(status: RequirementStatus, submittedDate?: string) {
  const configs = {
    pending: { bg: 'rgba(220,80,40,0.08)', border: 'rgba(220,80,40,0.25)', color: '#b33a1a', label: 'Action Required' },
    submitted: { bg: 'rgba(59,110,200,0.08)', border: 'rgba(59,110,200,0.25)', color: '#1e50a8', label: submittedDate ? `Submitted ${submittedDate}` : 'Submitted' },
    received: { bg: 'rgba(34,140,80,0.08)', border: 'rgba(34,140,80,0.25)', color: '#186038', label: 'Received ✓' },
    waived: { bg: 'rgba(150,150,150,0.08)', border: 'rgba(150,150,150,0.25)', color: '#666', label: 'Waived' },
  }
  const c = configs[status]
  return (
    <span style={{
      fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
      padding: '3px 10px', borderRadius: '999px',
      background: c.bg, border: `1px solid ${c.border}`, color: c.color, whiteSpace: 'nowrap',
    }}>
      {c.label}
    </span>
  )
}

function RequirementRow({ req, groupLabel }: { req: RequirementItem; groupLabel: string }) {
  const dotColor = req.status === 'received' ? '#22803F'
    : req.status === 'submitted' ? '#1e50a8'
    : req.status === 'waived' ? '#aaa'
    : '#cc4a1a'

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '14px',
      padding: '16px 0', borderBottom: '1px solid rgba(0,0,0,0.05)',
    }}>
      <div style={{
        width: '8px', height: '8px', borderRadius: '50%',
        background: dotColor, marginTop: '6px', flexShrink: 0,
      }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--charcoal)' }}>{req.label}</div>
          {statusBadge(req.status, req.submittedDate)}
        </div>
        <div style={{ fontSize: '13px', color: '#888', marginTop: '4px', lineHeight: 1.5 }}>{req.description}</div>
        {req.submittedDate && req.status === 'submitted' && (
          <div style={{ fontSize: '11px', color: '#aaa', marginTop: '4px' }}>Submitted on {req.submittedDate} — awaiting underwriter confirmation</div>
        )}
      </div>
    </div>
  )
}

function FullTracker({ plan }: { plan: InsurancePlan }) {
  const activeIdx = getStageIndex(plan.underwritingStage)

  return (
    <div style={{
      background: '#fff', borderRadius: 'var(--radius)',
      border: '1px solid rgba(0,0,0,0.07)', boxShadow: 'var(--shadow-sm)',
      padding: '2.5rem',
    }}>
      <div style={{ fontSize: '11px', fontWeight: 700, color: '#aaa', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '2rem' }}>
        Underwriting Progress
      </div>

      {/* Horizontal tracker */}
      <div style={{ overflowX: 'auto', paddingBottom: '12px', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', minWidth: '680px' }}>
          {STAGES.map((stage, i) => {
            const isComplete = i < activeIdx
            const isActive = i === activeIdx

            return (
              <div key={stage.key} style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '72px', flexShrink: 0 }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: isComplete ? '#22803F' : isActive ? 'var(--gold)' : '#fff',
                    border: isComplete ? '2.5px solid #22803F' : isActive ? '2.5px solid var(--gold)' : '2px solid #ddd',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: (isComplete || isActive) ? '#fff' : '#ccc',
                    fontSize: isComplete ? '18px' : '14px', fontWeight: 700,
                    boxShadow: isActive ? '0 0 0 6px rgba(201,168,76,0.18)' : 'none',
                    animation: isActive ? 'tracker-pulse 2.2s ease-out infinite' : 'none',
                    position: 'relative', zIndex: 1, flexShrink: 0,
                  }}>
                    {isComplete ? '✓' : i + 1}
                  </div>
                  <div style={{
                    fontSize: '10px', textAlign: 'center', marginTop: '10px', lineHeight: 1.3,
                    fontWeight: isActive ? 700 : 400,
                    color: isComplete ? '#22803F' : isActive ? 'var(--maroon)' : '#bbb',
                    maxWidth: '72px',
                  }}>
                    {stage.shortLabel}
                  </div>
                </div>
                {i < STAGES.length - 1 && (
                  <div style={{
                    flex: 1, height: '2px', marginTop: '23px',
                    background: isComplete ? '#22803F' : 'rgba(0,0,0,0.08)',
                  }} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Vertical stage list */}
      <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1.5rem' }}>
        {STAGES.map((stage, i) => {
          const isComplete = i < activeIdx
          const isActive = i === activeIdx

          return (
            <div key={stage.key} style={{
              display: 'flex', gap: '16px', padding: '12px 0',
              opacity: !isComplete && !isActive ? 0.4 : 1,
            }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                background: isComplete ? '#22803F' : isActive ? 'var(--gold)' : 'transparent',
                border: isComplete ? '2px solid #22803F' : isActive ? '2px solid var(--gold)' : '2px solid #ddd',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: (isComplete || isActive) ? '#fff' : '#ccc',
                fontSize: isComplete ? '12px' : '10px', fontWeight: 700,
              }}>
                {isComplete ? '✓' : i + 1}
              </div>
              <div>
                <div style={{
                  fontSize: '14px', fontWeight: isActive ? 700 : 600,
                  color: isComplete ? '#22803F' : isActive ? 'var(--maroon)' : '#999',
                }}>
                  {stage.label}
                  {isActive && (
                    <span style={{
                      marginLeft: '10px', fontSize: '9px', fontWeight: 700,
                      background: 'var(--gold)', color: '#fff',
                      borderRadius: '999px', padding: '2px 8px', letterSpacing: '0.08em', textTransform: 'uppercase',
                    }}>
                      Current
                    </span>
                  )}
                </div>
                {isActive && (
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{stage.description}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function RequirementsPanel({ plan }: { plan: InsurancePlan }) {
  const hasInitial = !!plan.initialRequirements?.length
  const hasFollowup = !!plan.followupRequirements?.length
  const activeIdx = getStageIndex(plan.underwritingStage)
  const reqIdx = getStageIndex('initial_requirements')

  if (!hasInitial && !hasFollowup) return null
  if (activeIdx < reqIdx) return null

  return (
    <div style={{ marginTop: '2rem' }}>
      {/* Initial requirements */}
      {hasInitial && (
        <div style={{
          background: '#fff', borderRadius: 'var(--radius)',
          border: '1px solid rgba(0,0,0,0.07)', boxShadow: 'var(--shadow-sm)',
          padding: '2rem', marginBottom: '1.5rem',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#aaa', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Initial Requirements
          </div>
          {plan.initialRequirements!.map((req) => (
            <RequirementRow key={req.id} req={req} groupLabel="Initial" />
          ))}
        </div>
      )}

      {/* Follow-up requirements */}
      {hasFollowup && (
        <div style={{
          background: '#fff', borderRadius: 'var(--radius)',
          border: '1px solid rgba(0,0,0,0.07)', boxShadow: 'var(--shadow-sm)',
          padding: '2rem',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#aaa', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Follow-up Requirements
          </div>
          {plan.followupRequirements!.map((req) => (
            <RequirementRow key={req.id} req={req} groupLabel="Follow-up" />
          ))}
        </div>
      )}
    </div>
  )
}

export default async function PolicyDetailPage({ params }: Props) {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  const { policyId } = await params
  const plan = INSURANCE_PLACEHOLDERS.find((p) => p.id === policyId)
  if (!plan) notFound()

  const activeIdx = getStageIndex(plan.underwritingStage)
  const isInForce = plan.underwritingStage === 'in_force'

  const typeColor: Record<string, string> = {
    'Life Insurance': '#6B2737',
    'Critical Illness': '#1a4a6b',
    'Income Protection': '#2a5a3a',
  }
  const accentColor = typeColor[plan.type] ?? 'var(--maroon)'

  const allPending = [
    ...(plan.initialRequirements ?? []),
    ...(plan.followupRequirements ?? []),
  ].filter((r) => r.status === 'pending')

  return (
    <div className="portal-root" style={{ background: 'var(--cream)', minHeight: '100vh' }}>

      {/* TOPBAR */}
      <div style={{ background: 'var(--maroon)', color: 'rgba(255,255,255,0.9)', fontSize: '13px', height: 'var(--nav-top-h)', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ fontWeight: 500, letterSpacing: '0.02em' }}>Private Client Portal</div>
          <div style={{ display: 'flex', gap: '20px', fontWeight: 600 }}>
            <a href="https://iberianpacific.ca/contact" style={{ color: 'inherit' }}>Support</a>
            <a href="https://iberianpacific.ca/services" style={{ color: 'inherit' }}>Services</a>
          </div>
        </div>
      </div>

      {/* MAIN NAV */}
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
              <a href="/education" style={{ color: 'inherit' }}>Education</a>
              <a href="/benefits" style={{ color: 'var(--white)', borderBottom: '2px solid var(--gold)', paddingBottom: '4px' }}>Benefits Plan</a>
              <a href="https://iberianpacific.ca/insights" style={{ color: 'inherit' }}>Insights</a>
            </nav>
            <div style={{ paddingLeft: '15px', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      {/* PAGE BODY */}
      <main className="container" style={{ padding: '3rem 24px 5rem' }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom: '2rem', fontSize: '13px', color: '#999', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <a href="/benefits" style={{ color: 'var(--gold)', fontWeight: 600 }}>&larr; Benefits Plan</a>
          <span>/</span>
          <span>{plan.name}</span>
        </div>

        {/* Policy hero */}
        <div style={{
          background: accentColor,
          borderRadius: 'var(--radius)',
          padding: '3rem',
          marginBottom: '2.5rem',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '2rem',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '10px' }}>
              {plan.type} · {plan.carrier}
            </div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontFamily: 'var(--font-display)', color: '#fff', marginBottom: '1rem', fontWeight: 700 }}>
              {plan.name}
            </h1>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              {plan.submittedDate && (
                <div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Applied</div>
                  <div style={{ fontSize: '15px', color: '#fff', fontWeight: 600, marginTop: '2px' }}>{plan.submittedDate}</div>
                </div>
              )}
              {plan.policyNumber && (
                <div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Policy #</div>
                  <div style={{ fontSize: '15px', color: '#fff', fontWeight: 600, marginTop: '2px' }}>{plan.policyNumber}</div>
                </div>
              )}
              {plan.effectiveDate && (
                <div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Effective</div>
                  <div style={{ fontSize: '15px', color: '#fff', fontWeight: 600, marginTop: '2px' }}>{plan.effectiveDate}</div>
                </div>
              )}
              {/* Current stage badge */}
              <div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Status</div>
                <div style={{
                  marginTop: '4px',
                  display: 'inline-flex', alignItems: 'center',
                  fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                  background: isInForce ? 'rgba(34,200,100,0.2)' : 'rgba(201,168,76,0.2)',
                  border: isInForce ? '1px solid rgba(34,200,100,0.4)' : '1px solid rgba(201,168,76,0.4)',
                  color: isInForce ? '#5dde96' : 'var(--gold)',
                  borderRadius: '999px', padding: '4px 12px',
                }}>
                  {isInForce ? '● In Force' : `Step ${activeIdx + 1} of ${STAGES.length}`}
                </div>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            {plan.coverageAmount && (
              <>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>Coverage</div>
                <div style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--font-display)', fontWeight: 700, color: '#fff', lineHeight: 1 }}>
                  {plan.coverageAmount}
                </div>
              </>
            )}
            {plan.premium && (
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginTop: '8px', fontWeight: 500 }}>
                {plan.premium} premium
              </div>
            )}
          </div>
        </div>

        {/* Action required banner */}
        {allPending.length > 0 && (
          <div style={{
            background: 'rgba(220,80,40,0.06)',
            border: '1px solid rgba(220,80,40,0.2)',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(220,80,40,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '16px' }}>
              ⚠️
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#b33a1a', marginBottom: '2px' }}>
                {allPending.length} outstanding requirement{allPending.length > 1 ? 's' : ''} need{allPending.length === 1 ? 's' : ''} your attention
              </div>
              <div style={{ fontSize: '13px', color: '#c0614a' }}>
                {allPending.map((r) => r.label).join(' · ')}
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>

          {/* Left column: tracker + requirements */}
          <div>
            <FullTracker plan={plan} />
            <RequirementsPanel plan={plan} />
          </div>

          {/* Right column: coverage details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Coverage highlights */}
            {plan.coverageHighlights && plan.coverageHighlights.length > 0 && (
              <div style={{
                background: '#fff', borderRadius: 'var(--radius)',
                border: '1px solid rgba(0,0,0,0.07)', boxShadow: 'var(--shadow-sm)',
                padding: '2rem',
              }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#aaa', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                  What This Policy Covers
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {plan.coverageHighlights.map((highlight, i) => (
                    <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <span style={{
                        width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                        background: 'rgba(201,168,76,0.12)',
                        border: '1.5px solid rgba(201,168,76,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '10px', color: 'var(--gold)', fontWeight: 700,
                        marginTop: '1px',
                      }}>
                        ✓
                      </span>
                      <span style={{ fontSize: '13px', color: '#555', lineHeight: 1.55 }}>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Advisor note */}
            {plan.advisorNote && (
              <div style={{
                background: 'rgba(201,168,76,0.05)',
                borderRadius: 'var(--radius)',
                border: '1px solid rgba(201,168,76,0.2)',
                padding: '1.5rem',
              }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Advisor Note
                </div>
                <p style={{ fontSize: '13px', color: '#666', margin: 0, lineHeight: 1.65 }}>{plan.advisorNote}</p>
              </div>
            )}

            {/* Actions */}
            <div style={{
              background: '#fff', borderRadius: 'var(--radius)',
              border: '1px solid rgba(0,0,0,0.07)', boxShadow: 'var(--shadow-sm)',
              padding: '1.5rem',
              display: 'flex', flexDirection: 'column', gap: '10px',
            }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#aaa', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>
                Actions
              </div>
              {plan.portalUrl ? (
                <a href={plan.portalUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontSize: '13px', width: '100%', justifyContent: 'center' }}>
                  View at {plan.carrier} Portal
                </a>
              ) : (
                <div style={{
                  padding: '10px 16px', borderRadius: '999px', fontSize: '13px',
                  background: 'var(--cream)', border: '1px solid rgba(0,0,0,0.08)',
                  color: '#aaa', textAlign: 'center', fontStyle: 'italic',
                }}>
                  Carrier portal available once in force
                </div>
              )}
              <a href="https://iberianpacific.ca/contact" className="btn btn-secondary" style={{ fontSize: '13px', width: '100%', justifyContent: 'center' }}>
                Contact My Advisor
              </a>
              <a href="/benefits" className="btn" style={{ fontSize: '13px', width: '100%', justifyContent: 'center', border: 'none', background: 'none', color: '#999' }}>
                &larr; Back to All Policies
              </a>
            </div>

          </div>
        </div>

        {/* In force celebration */}
        {isInForce && (
          <div style={{
            marginTop: '3rem',
            background: 'linear-gradient(135deg, #1a4a2a 0%, #22603a 100%)',
            borderRadius: 'var(--radius)',
            padding: '3rem',
            textAlign: 'center',
            color: '#fff',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🛡️</div>
            <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', color: '#fff', marginBottom: '1rem' }}>
              You are fully protected.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '480px', margin: '0 auto 1.5rem', lineHeight: 1.65 }}>
              Your {plan.name} through {plan.carrier} is active and in force. Your coverage began {plan.effectiveDate ?? 'upon delivery receipt'}.
            </p>
            {plan.portalUrl && (
              <a href={plan.portalUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontSize: '14px' }}>
                View Your Policy at {plan.carrier}
              </a>
            )}
          </div>
        )}

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
