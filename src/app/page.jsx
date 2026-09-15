import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Bot, Terminal, Code2, Activity, Bug, BookOpen } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-heading font-bold text-on-surface mb-2">Welcome Back, Architect.</h1>
        <p className="text-on-surface-variant font-medium text-lg">Neural inference active. Ready to synthesize your next module.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-mono text-on-surface-variant uppercase flex items-center justify-between">
              Active Sessions
              <Terminal size={16} className="text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold">4</div>
            <p className="text-xs text-emerald-400 mt-1 flex items-center"><Activity size={12} className="mr-1" /> +2 from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-mono text-on-surface-variant uppercase flex items-center justify-between">
              Tokens Consumed
              <Code2 size={16} className="text-secondary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-bold">142K</div>
            <p className="text-xs text-on-surface-variant mt-1">Within daily quota limits</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activity Stream</CardTitle>
              <Badge status="info">Live Feed</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-surface-bright/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-on-surface">AI Mentor generated 42 lines of React code for <span className="font-mono text-secondary">AuthContext.tsx</span>.</p>
                  <p className="text-xs text-on-surface-variant mt-1">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-surface-bright/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0">
                  <Activity size={16} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-on-surface">Successfully deployed 3 new components to staging.</p>
                  <p className="text-xs text-on-surface-variant mt-1">45 minutes ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="primary" className="w-full justify-start">
              <Bot size={18} className="mr-2" /> Start New Session
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              <Bug size={18} className="mr-2" /> Analyze Error Logs
            </Button>
            <Button variant="ghost" className="w-full justify-start border border-outline-variant/30">
              <BookOpen size={18} className="mr-2" /> Review Documentation
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
