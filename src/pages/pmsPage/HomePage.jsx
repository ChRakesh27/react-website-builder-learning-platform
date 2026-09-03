import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../components/Toast.jsx';
import { useScrollReveal } from '../../hooks/useScrollReveal.js';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { loadDashboard } from '../../api/dashboard.js';

function AnimatedCard({ children, delay = 0 }) {
  const [ref, isVisible] = useScrollReveal();
  return (
    <div ref={ref} style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)', transition: `all 0.5s ease-out ${delay}ms` }}>
      {children}
    </div>
  );
}

export default function HomePage() {
  const [stats, setStats] = useState({ projects: 0, employees: 0, tasks: 0 });
  const toast = useToast();

  useEffect(() => {
    (async () => {
      const { projects, employees, tasks } = await loadDashboard();
      setStats({
        projects: projects.data?.length || 0,
        employees: employees.data?.length || 0,
        tasks: tasks.data?.length || 0,
      });
      toast('Dashboard loaded successfully', 'success', 2000);
    })();
  }, [toast]);

  const statCards = [
    { label: 'Projects', value: stats.projects, desc: 'Active project records' },
    { label: 'Employees', value: stats.employees, desc: 'Employee records in database' },
    { label: 'Tasks', value: stats.tasks, desc: 'Task items being tracked' },
    { label: 'Velocity', value: '78%', desc: 'Delivery pace this sprint' },
  ];

  return (
    <div className="space-y-6">
      <section className="home-hero animate-fade-in-up">
        <div className="hero-copy">
          <p className="eyebrow">Dashboard</p>
          <h1>Project control center</h1>
          <p className="lead">View workload, team activity, and delivery trends in one place.</p>
          <div className="button-row">
            <Button asChild><Link to="/projects/new">New Project</Link></Button>
            <Button asChild variant="outline"><Link to="/projects">Open Projects</Link></Button>
          </div>
          <div className="hero-points">
            <span>30+ section guides</span>
            <span>Copy prompts</span>
            <span>Responsive rules</span>
          </div>
        </div>
        <div className="hero-product-card">
          <div className="browser-dots"><span /><span /><span /></div>
          <div className="product-grid">
            <div className="product-sidebar">
              <span>Plan</span><span>Sections</span><span>Style</span><span>Deploy</span>
            </div>
            <div className="product-main">
              <div className="product-title">Student Website Builder</div>
              <div className="product-subtitle">Track progress from idea to launch</div>
              <div className="product-cards">
                <span>Layout</span><span>Prompt</span><span>Checklist</span>
              </div>
              <div className="product-wide">Current Task: Build responsive hero + CTA section</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid four">
        {statCards.map((card, i) => (
          <AnimatedCard key={card.label} delay={i * 100}>
            <Card>
              <CardHeader><CardDescription>{card.label}</CardDescription><CardTitle className="text-3xl">{card.value}</CardTitle></CardHeader>
              <CardContent>{card.desc}</CardContent>
            </Card>
          </AnimatedCard>
        ))}
      </section>

      <section className="grid two">
        <AnimatedCard delay={400}>
          <Card>
            <CardHeader><CardTitle>Workload chart</CardTitle></CardHeader>
            <CardContent>
              <div className="dashboard-bars space-y-3">
                {[
                  { label: 'Design', width: '78%' },
                  { label: 'Development', width: '54%' },
                  { label: 'QA', width: '31%' },
                  { label: 'Deployment', width: '68%' },
                ].map((bar, i) => (
                  <div key={bar.label} className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-24 text-right">{bar.label}</span>
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-out" style={{ width: bar.width }} />
                    </div>
                    <span className="text-sm font-bold text-muted-foreground w-8">{bar.width}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>
        <AnimatedCard delay={500}>
          <Card>
            <CardHeader><CardTitle>Activity stream</CardTitle></CardHeader>
            <CardContent>
              <div className="timeline-list">
                {[
                  { num: '1', title: 'Project kickoff', desc: 'New project request arrives and gets assigned.' },
                  { num: '2', title: 'Task creation', desc: 'Tasks and subtasks are broken down by team.' },
                  { num: '3', title: 'Status update', desc: 'Work moves from To Do to Done through the board.' },
                ].map((item, i) => (
                  <div key={item.num} className="timeline-item">
                    <span>{item.num}</span>
                    <div>
                      <strong>{item.title}</strong>
                      <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>
      </section>
    </div>
  );
}