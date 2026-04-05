import type { ContentItem } from './types';

export const STORAGE_KEY = 'edufree_content';
export const AUTH_KEY = 'edufree_admin_auth';
export const PASS_KEY = 'edufree_admin_pass';
export const DEFAULT_PASS = 'admin';

export const defaultContent: ContentItem[] = [
  {
    id: '1',
    type: 'course',
    title: 'Introduction to Calculus',
    subject: 'Math',
    description: 'Learn the fundamentals of differential and integral calculus.',
    content:
      'Calculus is the mathematical study of continuous change.\n\nTopics covered:\n- Limits and continuity\n- Derivatives and differentiation rules\n- Integration techniques\n- The Fundamental Theorem of Calculus\n\nThe derivative is defined as:\nf\'(x) = lim(h→0) [f(x+h) - f(x)] / h\n\nThe integral (antiderivative) reverses differentiation:\n∫f\'(x)dx = f(x) + C',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    type: 'course',
    title: 'Newtonian Mechanics',
    subject: 'Physics',
    description: "Explore Newton's laws of motion and their applications.",
    content:
      "Newton's three laws of motion form the foundation of classical mechanics:\n\n1. Law of Inertia:\nAn object at rest stays at rest, and an object in motion stays in motion at constant velocity, unless acted upon by an external force.\n\n2. F = ma:\nThe net force on an object equals its mass times its acceleration.\n\n3. Action-Reaction:\nFor every action there is an equal and opposite reaction.\n\nApplications include projectile motion, orbital mechanics, and engineering design.",
    createdAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    type: 'code',
    title: 'Solving Quadratic Equations',
    subject: 'Math',
    description: 'Python code to find roots of ax² + bx + c = 0 using the quadratic formula.',
    content: `import math

def solve_quadratic(a, b, c):
    """Solve ax^2 + bx + c = 0 and return real roots."""
    discriminant = b**2 - 4*a*c
    if discriminant < 0:
        return None  # No real roots
    elif discriminant == 0:
        return (-b / (2*a),)
    else:
        x1 = (-b + math.sqrt(discriminant)) / (2*a)
        x2 = (-b - math.sqrt(discriminant)) / (2*a)
        return (x1, x2)

# Example: x^2 - 5x + 6 = 0  =>  roots: 3 and 2
print(solve_quadratic(1, -5, 6))   # (3.0, 2.0)`,
    language: 'python',
    createdAt: '2024-01-03T00:00:00Z',
  },
  {
    id: '4',
    type: 'code',
    title: 'Projectile Motion Simulation',
    subject: 'Physics',
    description: 'Compute range, max height, and flight time for a projectile.',
    content: `import math

def projectile(v0, angle_deg, g=9.81):
    """Return flight time, range, and max height of a projectile."""
    angle = math.radians(angle_deg)
    vx = v0 * math.cos(angle)
    vy = v0 * math.sin(angle)
    t_flight = 2 * vy / g
    range_ = vx * t_flight
    max_height = vy**2 / (2 * g)
    return {
        "time_of_flight_s": round(t_flight, 3),
        "range_m": round(range_, 3),
        "max_height_m": round(max_height, 3),
    }

# Launch at 50 m/s at 45 degrees
print(projectile(50, 45))`,
    language: 'python',
    createdAt: '2024-01-04T00:00:00Z',
  },
];

export function loadContent(): ContentItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as ContentItem[];
    }
  } catch {
    // ignore parse errors, fall back to defaults
  }
  return defaultContent;
}

export function saveContent(items: ContentItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(AUTH_KEY) === 'true';
}

export function login(password: string): boolean {
  const stored = localStorage.getItem(PASS_KEY) ?? DEFAULT_PASS;
  if (password === stored) {
    sessionStorage.setItem(AUTH_KEY, 'true');
    return true;
  }
  return false;
}

export function logout(): void {
  sessionStorage.removeItem(AUTH_KEY);
}

export function changePassword(newPass: string): void {
  localStorage.setItem(PASS_KEY, newPass);
}
