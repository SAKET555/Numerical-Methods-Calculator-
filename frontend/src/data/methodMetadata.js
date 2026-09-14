export const methodMetadata = {
  "fixed-point": {
    title: "1. Fixed-Point Iteration Method",
    category: "Module 1: Solution of Equations",
    description: "Solves non-linear equation f(x) = 0 by rewriting it in the form x = g(x) and computing successive approximations x_{n+1} = g(x_n).",
    formulaLatex: "x_{n+1} = g(x_n)",
    inputs: {
      g_expr: {
        label: "Iteration Function g(x)",
        type: "text",
        default: "cos(x)",
        description: "The mathematical expression g(x) where x = g(x). Must satisfy |g'(x)| < 1 near root for convergence.",
        placeholder: "e.g. cos(x), (x+2/x)/2"
      },
      x0: {
        label: "Initial Seed / Guess (x₀)",
        type: "number",
        default: 0.5,
        description: "Starting numerical seed near which the root is expected to lie.",
        placeholder: "0.5"
      },
      tol: {
        label: "Convergence Tolerance (ε)",
        type: "number",
        default: 1e-6,
        description: "Absolute stopping criterion: iterations stop when |x_{n+1} - x_n| < tol.",
        placeholder: "0.000001"
      },
      max_iter: {
        label: "Maximum Iterations Cap",
        type: "number",
        default: 30,
        description: "Upper bound on iterations to prevent infinite loops if the function diverges.",
        placeholder: "30"
      }
    },
    outputGuide: {
      summary: "Evaluates fixed-point root where x = g(x).",
      columns: {
        n: "Step index (0-based iteration count)",
        x_n: "Current approximation value at step n",
        g_xn: "Function evaluation g(x_n) which becomes x_{n+1}",
        diff: "Absolute step difference |x_{n+1} - x_n| used for tolerance check"
      },
      interpretation: (res, prec) => `The Fixed-Point iteration ${res.converged ? 'successfully converged' : 'reached max iterations'} at x = ${Number(res.root).toFixed(prec)}. At this root, g(x) ≈ ${Number(res.root).toFixed(prec)}, satisfying x = g(x).`
    }
  },

  "secant": {
    title: "2. Secant Method",
    category: "Module 1: Solution of Equations",
    description: "Finds roots of f(x) = 0 using two initial approximations without requiring derivative evaluation.",
    formulaLatex: "x_{n+1} = x_n - f(x_n) \\frac{x_n - x_{n-1}}{f(x_n) - f(x_{n-1})}",
    inputs: {
      f_expr: {
        label: "Target Function f(x)",
        type: "text",
        default: "x^3 - x - 2",
        description: "The non-linear continuous equation f(x) whose root f(x) = 0 is desired.",
        placeholder: "e.g. x^3 - x - 2"
      },
      x0: {
        label: "First Initial Point (x₀)",
        type: "number",
        default: 1.0,
        description: "First boundary seed near the root.",
        placeholder: "1.0"
      },
      x1: {
        label: "Second Initial Point (x₁)",
        type: "number",
        default: 2.0,
        description: "Second boundary seed near the root (x₁ ≠ x₀).",
        placeholder: "2.0"
      },
      tol: {
        label: "Tolerance (ε)",
        type: "number",
        default: 1e-6,
        description: "Target precision limit |x_{n+1} - x_n| < tol.",
        placeholder: "0.000001"
      },
      max_iter: {
        label: "Maximum Iterations Cap",
        type: "number",
        default: 30,
        description: "Maximum allowable secant iterations.",
        placeholder: "30"
      }
    },
    outputGuide: {
      summary: "Approximates root of f(x) = 0 via secant line intersections.",
      columns: {
        n: "Iteration step counter",
        x_prev: "Previous boundary point x_{n-1}",
        x_curr: "Current estimate point x_n",
        f_curr: "Function magnitude f(x_n)",
        x_next: "Newly calculated secant intersection point x_{n+1}",
        error: "Absolute error estimate |x_{n+1} - x_n|"
      },
      interpretation: (res, prec) => `The Secant algorithm ${res.converged ? 'converged' : 'stopped'} after ${res.total_iters} steps, finding root x = ${Number(res.root).toFixed(prec)}.`
    }
  },

  "gauss-seidel": {
    title: "3. Gauss-Seidel Method",
    category: "Module 1: Linear Systems",
    description: "Iterative technique for solving 3x3 linear system A x = B using updated values immediately upon computation.",
    formulaLatex: "x_i^{(k+1)} = \\frac{1}{a_{ii}} \\left( b_i - \\sum_{j < i} a_{ij} x_j^{(k+1)} - \\sum_{j > i} a_{ij} x_j^{(k)} \\right)",
    inputs: {
      A: {
        label: "Coefficient Matrix A (3x3)",
        description: "Square 3x3 matrix of system linear coefficients. Ideally diagonally dominant (|a_ii| ≥ ∑|a_ij|).",
        default: [[10, -1, 2], [-1, 11, -1], [2, -1, 10]]
      },
      B: {
        label: "Constant RHS Vector B (3x1)",
        description: "Right-hand side column values [b₁, b₂, b₃].",
        default: [6, 25, -11]
      },
      x0: {
        label: "Initial Solution Guess [x₁, x₂, x₃]",
        description: "Initial seed values for system variables (commonly zero vector [0, 0, 0]).",
        default: [0, 0, 0]
      },
      tol: {
        label: "Convergence Tolerance",
        description: "Max absolute variation in vector components between steps max|x_i^{(k+1)} - x_i^{(k)}| < tol.",
        default: 1e-6
      },
      max_iter: {
        label: "Iteration Limit",
        description: "Maximum iterative step budget.",
        default: 30
      }
    },
    outputGuide: {
      summary: "Computes unique solution vector X for linear system Ax = B.",
      columns: {
        iter: "Iteration step count",
        x_vector: "Updated solution vector state [x₁, x₂, x₃]",
        error: "Maximum absolute element-wise change across vector components"
      },
      interpretation: (res, prec) => `System solve completed in ${res.total_iters} iterations. Matrix A is ${res.is_diagonally_dominant ? 'diagonally dominant (guaranteed fast convergence)' : 'not strictly diagonally dominant'}. Solution: x₁ = ${Number(res.solution[0]).toFixed(prec)}, x₂ = ${Number(res.solution[1]).toFixed(prec)}, x₃ = ${Number(res.solution[2]).toFixed(prec)}.`
    }
  },

  "lagrange-interp": {
    title: "4. Lagrange's Interpolation",
    category: "Module 2: Interpolation",
    description: "Constructs polynomial P(x) passing through n given points and evaluates y at target point x_eval.",
    formulaLatex: "P(x) = \\sum_{i=0}^n y_i \\prod_{j \\neq i} \\frac{x - x_j}{x_i - x_j}",
    inputs: {
      x_points: {
        label: "X Coordinates Array [x₀, x₁, ...]",
        description: "Distinct independent variable sample points.",
        default: [5, 6, 9, 11]
      },
      y_points: {
        label: "Y Coordinates Array [y₀, y₁, ...]",
        description: "Dependent variable sample values corresponding to x_points.",
        default: [12, 13, 14, 16]
      },
      x_eval: {
        label: "Evaluation Target (x_eval)",
        description: "The x-coordinate at which to interpolate estimated y value.",
        default: 10
      }
    },
    outputGuide: {
      summary: "Interpolates functional value y(x_eval) using polynomial basis weights.",
      columns: {
        i: "Point index",
        x_i: "Sample x coordinate",
        y_i: "Sample y value",
        L_i_val: "Computed Lagrange basis polynomial term L_i(x_eval)",
        term_contribution: "Weighted contribution y_i * L_i(x_eval)"
      },
      interpretation: (res, prec) => `The interpolated value at x = ${res.x_eval || 10} is y = ${Number(res.y_eval).toFixed(prec)}. Reconstructed polynomial: P(x) = ${res.polynomial_str}.`
    }
  },

  "lagrange-inverse": {
    title: "5. Lagrange's Inverse Interpolation",
    category: "Module 2: Interpolation",
    description: "Finds the value of x for a given target y value when functional expression f(x) is unknown.",
    formulaLatex: "x(y) = \\sum_{i=0}^n x_i \\prod_{j \\neq i} \\frac{y - y_j}{y_i - y_j}",
    inputs: {
      x_points: {
        label: "Known X Coordinates Array",
        description: "Original independent sample coordinates.",
        default: [2, 5, 8, 14]
      },
      y_points: {
        label: "Known Y Coordinates Array",
        description: "Original dependent sample coordinates.",
        default: [94.8, 87.9, 81.3, 68.7]
      },
      y_eval: {
        label: "Target Y Value (y_eval)",
        description: "The y value for which to predict corresponding x coordinate.",
        default: 85.0
      }
    },
    outputGuide: {
      summary: "Estimates x value corresponding to given y_eval by treating x as a function of y.",
      columns: {
        i: "Point index",
        x_i: "Sample x coordinate",
        y_i: "Sample y value",
        L_i_val: "Inverse basis weight L'_i(y_eval)",
        term_contribution: "Partial term contribution x_i * L'_i(y_eval)"
      },
      interpretation: (res, prec) => `For target y = ${res.y_eval || 85}, predicted x = ${Number(res.x_eval).toFixed(prec)}.`
    }
  },

  "curve-fit": {
    title: "6. Least Squares Curve Fitting",
    category: "Module 2: Curve Fitting",
    description: "Fits optimal parameters for Linear (y=ax+b), Exponential (y=a*e^{bx}), or Parabolic (y=ax²+bx+c) models by minimizing sum of squared errors.",
    formulaLatex: "y = a x + b \\quad | \\quad y = a x^2 + b x + c \\quad | \\quad y = a e^{b x}",
    inputs: {
      x_points: {
        label: "Dataset X Points",
        description: "Array of independent measurement coordinates.",
        default: [1, 2, 3, 4, 5]
      },
      y_points: {
        label: "Dataset Y Points",
        description: "Array of dependent measurement coordinates.",
        default: [0.5, 2.5, 2.0, 4.0, 3.5]
      },
      model_type: {
        label: "Regression Model Type",
        description: "Select mathematical model architecture: Linear, Exponential, or Parabolic.",
        default: "linear"
      }
    },
    outputGuide: {
      summary: "Calculates normal equations matrix and best-fit coefficients.",
      columns: {
        N: "Total data points count",
        sums: "Intermediate sum terms (∑x, ∑y, ∑x², ∑xy, etc.) used to build normal matrix"
      },
      interpretation: (res, prec) => `Fitted Model: ${res.equation_str}. Parameters: ${Object.entries(res.coefficients).map(([k,v]) => `${k} = ${Number(v).toFixed(prec)}`).join(', ')}.`
    }
  },

  "simpsons": {
    title: "7. Simpson's 1/3 Rule",
    category: "Module 3: Integration",
    description: "Evaluates numerical definite integral over [a, b] by fitting parabolic arcs over sub-intervals.",
    formulaLatex: "\\int_a^b f(x) dx \\approx \\frac{h}{3} \\left[ f_0 + 4(f_1+f_3+\\dots) + 2(f_2+f_4+\\dots) + f_n \\right]",
    inputs: {
      f_expr: {
        label: "Integrand Function f(x)",
        description: "Continuous mathematical function to integrate.",
        default: "1 / (1 + x^2)"
      },
      a: {
        label: "Lower Bound (a)",
        description: "Starting integration limit.",
        default: 0.0
      },
      b: {
        label: "Upper Bound (b)",
        description: "Ending integration limit.",
        default: 6.0
      },
      n: {
        label: "Interval Count (n - Must be EVEN)",
        description: "Number of sub-intervals. Simpson's 1/3 rule requires n to be an even integer.",
        default: 6
      }
    },
    outputGuide: {
      summary: "Calculates composite integral with step size h = (b-a)/n.",
      columns: {
        i: "Grid node index",
        x_i: "Sub-interval node coordinate a + i*h",
        f_xi: "Evaluated integrand value f(x_i)",
        weight: "Simpson multiplier (1 for endpoints, 4 for odd nodes, 2 for even nodes)",
        term: "Weighted term product"
      },
      interpretation: (res, prec) => `Integral over [${res.grid[0].x_i}, ${res.grid[res.grid.length-1].x_i}] = ${Number(res.integral).toFixed(prec)} with step size h = ${Number(res.h).toFixed(prec)}.`
    }
  },

  "romberg": {
    title: "8. Romberg's Integration",
    category: "Module 3: Integration",
    description: "Combines Trapezoidal rule with Richardson extrapolation to generate high-accuracy integral approximations.",
    formulaLatex: "R(j, m) = R(j, m-1) + \\frac{R(j, m-1) - R(j-1, m-1)}{4^m - 1}",
    inputs: {
      f_expr: {
        label: "Integrand Function f(x)",
        description: "Function to integrate over interval [a, b].",
        default: "1 / (1 + x)"
      },
      a: {
        label: "Lower Limit (a)",
        description: "Start of integration interval.",
        default: 0.0
      },
      b: {
        label: "Upper Limit (b)",
        description: "End of integration interval.",
        default: 1.0
      },
      k: {
        label: "Romberg Depth / Order (k)",
        description: "Tableau depth level (k=4 generates a 4x4 Richardson extrapolation matrix).",
        default: 4
      }
    },
    outputGuide: {
      summary: "Generates lower-triangular Richardson extrapolation matrix R(j, k).",
      columns: {
        j: "Subdivision refinement level",
        k: "Extrapolation order column"
      },
      interpretation: (res, prec) => `High-accuracy integral estimate = ${Number(res.integral).toFixed(prec)} obtained at tableau element R(${res.k-1}, ${res.k-1}).`
    }
  },

  "gauss-quadrature": {
    title: "9. Gauss-Legendre Quadrature",
    category: "Module 3: Integration",
    description: "Evaluates integral by transforming domain [a, b] to [-1, 1] and computing weighted sum at optimal Gauss nodes.",
    formulaLatex: "\\int_a^b f(x) dx = \\frac{b-a}{2} \\sum_{i=1}^n w_i f\\left(\\frac{b-a}{2} t_i + \\frac{a+b}{2}\\right)",
    inputs: {
      f_expr: {
        label: "Integrand f(x)",
        description: "Function expression to integrate.",
        default: "x^2 + 2*x + 1"
      },
      a: {
        label: "Domain Start (a)",
        description: "Lower limit.",
        default: 0.0
      },
      b: {
        label: "Domain End (b)",
        description: "Upper limit.",
        default: 2.0
      },
      n_points: {
        label: "Quadrature Points Count",
        description: "Select 2-Point or 3-Point Gauss-Legendre nodes.",
        default: 3
      }
    },
    outputGuide: {
      summary: "Maps interval to [-1, 1] and evaluates Gauss node weights.",
      columns: {
        t_node: "Standard Gauss-Legendre node in [-1, 1]",
        x_mapped: "Transformed node coordinate in original interval [a, b]",
        weight: "Gauss weight w_i",
        f_val: "Function evaluation at mapped node f(x_mapped)"
      },
      interpretation: (res, prec) => `Integral value using ${res.n_points}-Point Gauss Quadrature = ${Number(res.integral).toFixed(prec)}.`
    }
  },

  "modified-euler": {
    title: "10. Modified Euler's Method (Heun's Method)",
    category: "Module 4: Differential Equations",
    description: "Predictor-Corrector method for initial value ODE dy/dx = f(x, y) with y(x₀) = y₀.",
    formulaLatex: "y_{n+1} = y_n + \\frac{h}{2} \\left[ f(x_n, y_n) + f(x_{n+1}, y_{n+1}^{(0)}) \\right]",
    inputs: {
      f_expr: {
        label: "ODE Derivative f(x, y)",
        description: "Right-hand side of differential equation dy/dx = f(x, y).",
        default: "x + y"
      },
      x0: {
        label: "Initial X (x₀)",
        description: "Initial independent variable point.",
        default: 0.0
      },
      y0: {
        label: "Initial Y (y₀)",
        description: "Known initial condition y(x₀).",
        default: 1.0
      },
      h: {
        label: "Step Size (h)",
        description: "Integration step size.",
        default: 0.1
      },
      x_end: {
        label: "Target X End",
        description: "End evaluation coordinate.",
        default: 0.5
      }
    },
    outputGuide: {
      summary: "Generates step-by-step trajectory with predictor and corrector values.",
      columns: {
        step: "Step index",
        x_n: "Current x value",
        y_n: "Current y value",
        y_pred: "Euler predicted value y_{n+1}^{(0)}",
        y_next: "Final corrected value y_{n+1}"
      },
      interpretation: (res, prec) => `Final state at x = ${Number(res.final_x).toFixed(prec)} is y = ${Number(res.final_y).toFixed(prec)}.`
    }
  },

  "rk4": {
    title: "11. 4th-Order Runge-Kutta (RK4)",
    category: "Module 4: Differential Equations",
    description: "Industry standard high-accuracy ODE solver calculating 4 intermediate slope estimators per step.",
    formulaLatex: "y_{n+1} = y_n + \\frac{h}{6} (k_1 + 2k_2 + 2k_3 + k_4)",
    inputs: {
      f_expr: {
        label: "ODE Expression f(x, y)",
        description: "Derivative expression dy/dx = f(x, y).",
        default: "x^2 + y^2"
      },
      x0: {
        label: "Initial X (x₀)",
        description: "Starting x coordinate.",
        default: 0.0
      },
      y0: {
        label: "Initial Y (y₀)",
        description: "Initial state value y(x₀).",
        default: 1.0
      },
      h: {
        label: "Step Size (h)",
        description: "Integration step increment.",
        default: 0.1
      },
      x_end: {
        label: "Target Endpoint (x_end)",
        description: "Desired evaluation point.",
        default: 0.2
      }
    },
    outputGuide: {
      summary: "Computes intermediate slope estimators k1, k2, k3, k4 for each step.",
      columns: {
        step: "Step counter",
        k1: "Initial slope at step start",
        k2: "Slope at midpoint using k1",
        k3: "Slope at midpoint using k2",
        k4: "Slope at endpoint using k3",
        y_next: "Weighted Runge-Kutta step output"
      },
      interpretation: (res, prec) => `RK4 integration complete. State at x = ${Number(res.final_x).toFixed(prec)} is y = ${Number(res.final_y).toFixed(prec)}.`
    }
  },

  "taylor": {
    title: "12. Taylor's Series Method",
    category: "Module 4: Differential Equations",
    description: "Approximates ODE solution near x₀ using Taylor series expansion with higher derivatives up to y⁴.",
    formulaLatex: "y(x) = y(x_0) + \\sum_{k=1}^4 \\frac{(x-x_0)^k}{k!} y^{(k)}(x_0)",
    inputs: {
      x0: {
        label: "Expansion Center (x₀)",
        description: "Base point for Taylor expansion.",
        default: 0.0
      },
      y0: {
        label: "Base Function Value (y₀)",
        description: "Known value y(x₀).",
        default: 1.0
      },
      x_eval: {
        label: "Target Evaluation Point (x)",
        description: "Point at which to evaluate series solution.",
        default: 0.1
      },
      derivatives: {
        label: "Derivative Values at (x₀, y₀)",
        description: "Values of y', y'', y''', y⁴ at expansion center x₀.",
        default: { y1: 1.0, y2: 2.0, y3: 3.0, y4: 4.0 }
      }
    },
    outputGuide: {
      summary: "Calculates individual term contributions (h^k/k!) * y^(k)(x₀).",
      columns: {
        order: "Derivative order k",
        derivative_val: "Evaluated derivative y^(k)(x₀)",
        term_val: "Computed series term (h^k / k!) * y^(k)(x₀)"
      },
      interpretation: (res, prec) => `Taylor expansion at x = ${res.terms[1]?.x_eval || 0.1} yields y ≈ ${Number(res.final_y).toFixed(prec)}.`
    }
  },

  "linear-bvp": {
    title: "13. 2-Point Linear BVP via Finite Differences",
    category: "Module 5: Boundary Value Problems",
    description: "Solves second-order linear BVP y'' + P(x)y' + Q(x)y = R(x) with boundary conditions y(a)=α, y(b)=β.",
    formulaLatex: "\\frac{y_{i+1} - 2y_i + y_{i-1}}{h^2} + P(x_i)\\frac{y_{i+1}-y_{i-1}}{2h} + Q(x_i) y_i = R(x_i)",
    inputs: {
      P_expr: { label: "P(x) Coefficient", description: "First derivative coefficient term.", default: "0" },
      Q_expr: { label: "Q(x) Coefficient", description: "Function multiplier coefficient term.", default: "x" },
      R_expr: { label: "R(x) RHS Expression", description: "Right-hand side forcing term.", default: "1" },
      a: { label: "Domain Start (a)", description: "Left boundary location.", default: 0.0 },
      b: { label: "Domain End (b)", description: "Right boundary location.", default: 1.0 },
      alpha: { label: "Left BC y(a)", description: "Boundary value at x=a.", default: 0.0 },
      beta: { label: "Right BC y(b)", description: "Boundary value at x=b.", default: 0.0 },
      h: { label: "Mesh Step Size (h)", description: "Grid spacing.", default: 0.25 }
    },
    outputGuide: {
      summary: "Constructs tridiagonal system Ax = B and computes interior node values.",
      columns: {
        x_grid: "Grid node spatial positions",
        y_values: "Computed boundary and interior solution values"
      },
      interpretation: (res, prec) => `Solved finite difference system for ${res.interior_count} interior nodes.`
    }
  },

  "laplace-poisson": {
    title: "14. 2D Laplace / Poisson Rectangular Solver",
    category: "Module 5: PDEs",
    description: "Solves 2D steady-state heat/potential equation ∇²u = g(x, y) on a rectangular grid using finite differences and Liebmann iteration.",
    formulaLatex: "\\nabla^2 u = \\frac{\\partial^2 u}{\\partial x^2} + \\frac{\\partial^2 u}{\\partial y^2} = g(x, y)",
    inputs: {
      Nx: { label: "Grid Columns (Nx)", description: "Number of horizontal nodes.", default: 6 },
      Ny: { label: "Grid Rows (Ny)", description: "Number of vertical nodes.", default: 6 },
      top: { label: "Top Boundary Temp (°C)", description: "Dirichlet condition on top edge.", default: 100.0 },
      bottom: { label: "Bottom Boundary Temp (°C)", description: "Dirichlet condition on bottom edge.", default: 0.0 },
      left: { label: "Left Boundary Temp (°C)", description: "Dirichlet condition on left edge.", default: 75.0 },
      right: { label: "Right Boundary Temp (°C)", description: "Dirichlet condition on right edge.", default: 50.0 },
      g_expr: { label: "Source Term g(x, y)", description: "RHS term (set to 0 for Laplace, non-zero for Poisson).", default: "0" }
    },
    outputGuide: {
      summary: "Computes 2D interior potential/temperature distribution matrix.",
      columns: {
        grid: "2D spatial matrix containing node potential/temperature values"
      },
      interpretation: (res, prec) => `Liebmann iteration ${res.converged ? 'converged' : 'stopped'} in ${res.total_iters} iterations for ${res.Ny}x${res.Nx} grid.`
    }
  },

  "crank-nicolson": {
    title: "15. 1D Heat Equation (Crank-Nicolson Implicit)",
    category: "Module 5: PDEs",
    description: "Solves parabolic heat equation ∂u/∂t = α ∂²u/∂x² using unconditionally stable implicit Crank-Nicolson method.",
    formulaLatex: "-\\frac{r}{2} u_{i-1}^{n+1} + (1+r) u_i^{n+1} - \\frac{r}{2} u_{i+1}^{n+1} = \\frac{r}{2} u_{i-1}^n + (1-r) u_i^n + \\frac{r}{2} u_{i+1}^n",
    inputs: {
      alpha: { label: "Thermal Diffusivity (α)", description: "Material diffusion coefficient.", default: 1.0 },
      dx: { label: "Spatial Mesh (Δx)", description: "Grid node spacing along rod.", default: 0.2 },
      dt: { label: "Time Step (Δt)", description: "Time increment per level.", default: 0.02 },
      t_steps: { label: "Time Levels Count", description: "Number of time steps to propagate.", default: 5 },
      L: { label: "Rod Length (L)", description: "Total spatial domain length.", default: 1.0 },
      u_ic_str: { label: "Initial Condition u(x, 0)", description: "Initial temperature profile expression along rod.", default: "sin(pi*x)" },
      u_left: { label: "Left Boundary u(0, t)", description: "Fixed temperature at x=0.", default: 0.0 },
      u_right: { label: "Right Boundary u(L, t)", description: "Fixed temperature at x=L.", default: 0.0 }
    },
    outputGuide: {
      summary: "Computes time evolution of temperature profile across spatial grid.",
      columns: {
        r_param: "Mesh parameter r = α * Δt / Δx²",
        time_levels: "Array of spatial temperature profiles per time level t"
      },
      interpretation: (res, prec) => `Crank-Nicolson implicit solve completed with mesh stability parameter r = ${Number(res.r_param).toFixed(prec)}.`
    }
  }
};
