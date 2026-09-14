export const syllabusExamples = {
  // Module 1
  "fixed-point": {
    g_expr: "cos(x)",
    x0: 0.5,
    tol: 1e-6,
    max_iter: 30,
    formulaLatex: "x_{n+1} = g(x_n)",
    description: "Find root for x = cos(x) starting from x_0 = 0.5"
  },
  "secant": {
    f_expr: "x^3 - x - 2",
    x0: 1.0,
    x1: 2.0,
    tol: 1e-6,
    max_iter: 30,
    formulaLatex: "x_{n+1} = x_n - f(x_n) \\frac{x_n - x_{n-1}}{f(x_n) - f(x_{n-1})}",
    description: "Solve f(x) = x^3 - x - 2 = 0 between [1, 2]"
  },
  "gauss-seidel": {
    A: [
      [10, -1, 2],
      [-1, 11, -1],
      [2, -1, 10]
    ],
    B: [6, 25, -11],
    x0: [0, 0, 0],
    tol: 1e-6,
    max_iter: 30,
    formulaLatex: "x_i^{(k+1)} = \\frac{1}{a_{ii}} \\left( b_i - \\sum_{j < i} a_{ij} x_j^{(k+1)} - \\sum_{j > i} a_{ij} x_j^{(k)} \\right)",
    description: "Solve 3x3 system: 10x - y + 2z = 6, -x + 11y - z = 25, 2x - y + 10z = -11"
  },

  // Module 2
  "lagrange-interp": {
    x_points: [5, 6, 9, 11],
    y_points: [12, 13, 14, 16],
    x_eval: 10,
    formulaLatex: "P(x) = \\sum_{i=0}^n y_i \\prod_{j \\neq i} \\frac{x - x_j}{x_i - x_j}",
    description: "Estimate y at x = 10 from given coordinates (5,12), (6,13), (9,14), (11,16)"
  },
  "lagrange-inverse": {
    x_points: [2, 5, 8, 14],
    y_points: [94.8, 87.9, 81.3, 68.7],
    y_eval: 85.0,
    formulaLatex: "x(y) = \\sum_{i=0}^n x_i \\prod_{j \\neq i} \\frac{y - y_j}{y_i - y_j}",
    description: "Find x where y = 85.0 using inverse interpolation"
  },
  "curve-fit": {
    x_points: [1, 2, 3, 4, 5],
    y_points: [0.5, 2.5, 2.0, 4.0, 3.5],
    model_type: "linear",
    formulaLatex: "y = a x + b \\quad \\text{or} \\quad y = a x^2 + b x + c \\quad \\text{or} \\quad y = a e^{b x}",
    description: "Fit least squares model to dataset"
  },

  // Module 3
  "simpsons": {
    f_expr: "1 / (1 + x^2)",
    a: 0.0,
    b: 6.0,
    n: 6,
    formulaLatex: "\\int_a^b f(x) dx \\approx \\frac{h}{3} \\left[ f_0 + 4(f_1+f_3+\\dots) + 2(f_2+f_4+\\dots) + f_n \\right]",
    description: "Evaluate integral of 1/(1+x^2) from 0 to 6 with n=6 intervals"
  },
  "romberg": {
    f_expr: "1 / (1 + x)",
    a: 0.0,
    b: 1.0,
    k: 4,
    formulaLatex: "R(j, m) = R(j, m-1) + \\frac{R(j, m-1) - R(j-1, m-1)}{4^m - 1}",
    description: "Richardson extrapolation integration of 1/(1+x) over [0, 1] with depth k=4"
  },
  "gauss-quadrature": {
    f_expr: "x^2 + 2*x + 1",
    a: 0.0,
    b: 2.0,
    n_points: 3,
    formulaLatex: "\\int_a^b f(x) dx = \\frac{b-a}{2} \\sum_{i=1}^n w_i f\\left(\\frac{b-a}{2} t_i + \\frac{a+b}{2}\\right)",
    description: "Evaluate integral of (x^2 + 2x + 1) from 0 to 2 using 3-Point Gauss-Legendre Quadrature"
  },

  // Module 4
  "modified-euler": {
    f_expr: "x + y",
    x0: 0.0,
    y0: 1.0,
    h: 0.1,
    x_end: 0.5,
    formulaLatex: "y_{n+1} = y_n + \\frac{h}{2} \\left[ f(x_n, y_n) + f(x_{n+1}, y_{n+1}^{(0)}) \\right]",
    description: "Solve dy/dx = x + y with y(0)=1, step h=0.1 up to x=0.5"
  },
  "rk4": {
    f_expr: "x^2 + y^2",
    x0: 0.0,
    y0: 1.0,
    h: 0.1,
    x_end: 0.2,
    formulaLatex: "y_{n+1} = y_n + \\frac{h}{6} (k_1 + 2k_2 + 2k_3 + k_4)",
    description: "Solve dy/dx = x^2 + y^2 with y(0)=1 up to x=0.2"
  },
  "taylor": {
    x0: 0.0,
    y0: 1.0,
    x_eval: 0.1,
    derivatives: { y1: 1.0, y2: 2.0, y3: 3.0, y4: 4.0 },
    formulaLatex: "y(x) = y(x_0) + \\sum_{k=1}^4 \\frac{(x-x_0)^k}{k!} y^{(k)}(x_0)",
    description: "Taylor expansion of y(x) at x=0.1 using derivatives up to y^{(4)}"
  },

  // Module 5
  "linear-bvp": {
    P_expr: "0",
    Q_expr: "x",
    R_expr: "1",
    a: 0.0,
    b: 1.0,
    alpha: 0.0,
    beta: 0.0,
    h: 0.25,
    formulaLatex: "\\frac{y_{i+1} - 2y_i + y_{i-1}}{h^2} + P(x_i)\\frac{y_{i+1}-y_{i-1}}{2h} + Q(x_i) y_i = R(x_i)",
    description: "Solve y'' + x y = 1 with y(0)=0, y(1)=0 and step h=0.25"
  },
  "laplace-poisson": {
    Nx: 6,
    Ny: 6,
    top: 100.0,
    bottom: 0.0,
    left: 75.0,
    right: 50.0,
    g_expr: "0",
    formulaLatex: "\\nabla^2 u = \\frac{\\partial^2 u}{\\partial x^2} + \\frac{\\partial^2 u}{\\partial y^2} = g(x, y)",
    description: "Solve 2D Laplace equation on 6x6 grid with Dirichlet boundary temperatures"
  },
  "crank-nicolson": {
    alpha: 1.0,
    dx: 0.2,
    dt: 0.02,
    t_steps: 5,
    L: 1.0,
    u_ic_str: "sin(pi*x)",
    u_left: 0.0,
    u_right: 0.0,
    formulaLatex: "-\\frac{r}{2} u_{i-1}^{n+1} + (1+r) u_i^{n+1} - \\frac{r}{2} u_{i+1}^{n+1} = \\frac{r}{2} u_{i-1}^n + (1-r) u_i^n + \\frac{r}{2} u_{i+1}^n",
    description: "Solve 1D Heat equation using Crank-Nicolson implicit method (r = alpha * dt / dx^2)"
  }
};
