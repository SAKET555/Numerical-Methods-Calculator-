# ⚡ NumCore Studio - Enterprise Numerical Computation Suite

**NumCore Studio** is an interactive, high-precision numerical computation web application designed for engineering students, researchers, and applied mathematicians. Built with a modern **AWS/Salesforce-inspired Enterprise Dark Slate interface**, it features **15 numerical algorithms across 5 modules**, instant syllabus preset loading, KaTeX mathematical formula rendering, customizable global floating-point precision, step-by-step iteration tables with crisp grid lines, and 2D heatmaps for partial differential equations (PDEs).

---

## 📖 Table of Contents
1. [Key Features](#-key-features)
2. [Parameter Guide ("What is What")](#-parameter-guide-what-is-what)
3. [Writing Functions & the Math Keyboard](#-writing-functions--the-math-keyboard)
4. [15 Numerical Methods & Module Reference](#-15-numerical-methods--module-reference)
5. [Installation & Setup Instructions](#-installation--setup-instructions)
6. [Testing & Verification](#-testing--verification)
7. [Project Architecture & File Structure](#-project-architecture--file-structure)

---

## ✨ Key Features

- **AWS / Salesforce Enterprise UI**: Dense, developer-grade workspace layout with dark slate aesthetics (`#0f172a`), breadcrumb navigation, and crisp parameter cards.
- **Global Floating-Point Accuracy Control**: Header dropdown allowing users to select decimal precision dynamically from **4 to 12 places** (e.g. `0.0001` up to `1e-12`). All iteration tables and final answer badges update instantly.
- **"What is What" Parameter Field Guides**: Every input input parameter includes explicit mathematical badges and plain-English explanations so users know exactly what values to provide.
- **Natural Language Output Interpretations**: Plain-English interpretation cards explaining computed roots, convergence rates, error tolerances, and table column definitions.
- **2D Mesh PDE Heatmap Visualizer**: Color-mapped spatial heat distribution grids for 2D Laplace / Poisson equations and 1D Heat Equation time evolutions.
- **Math Keyboard**: A calculator-style panel on the right appears for every method that takes a function (`f(x)`, `g(x)`, `P/Q/R(x)`, `g(x, y)`, initial condition). Click a function field, then use the keys for `√`, `∛`, `ⁿ√`, `sin/cos/tan` (+ inverse and hyperbolic), `ln`, `log₁₀`, `eˣ`, `π`, `d/dx`, `∫ dx`, `∫ₐᵗ`, `Σ`, `lim`, digits and operators. Keys insert at the cursor; you can also type by hand (`^` = power, `2x` = `2*x`).
- **Instant Syllabus Example Loader**: Preset buttons for every method to load standard academic textbook examples in a single click.

---

## ❓ Parameter Guide ("What is What")

Below is a cheat-sheet explaining common input parameters used across the numerical solvers:

| Parameter Symbol | Full Name | Plain-English Explanation ("What it Is") | Example Value |
| :--- | :--- | :--- | :--- |
| **`x0` ($x_0$)** | Initial Seed / Guess | The starting numerical number from which the algorithm begins searching for a root or solution. | `0.5`, `1.0` |
| **`x1` ($x_1$)** | Second Seed | Second starting point used in 2-point methods like Secant to calculate initial line slopes. | `2.0` |
| **`tol` ($\varepsilon$)** | Convergence Tolerance | The target error precision limit. Iterations terminate when step variation $\|x_{n+1} - x_n\| < \text{tol}$. | `0.000001` (`1e-6`) |
| **`max_iter`** | Max Iterations Cap | Maximum number of calculation steps allowed before stopping to prevent infinite loops. | `30`, `50` |
| **`f_expr` / `g_expr`** | Function Expression | Mathematical function written in standard string syntax (e.g., `cos(x)`, `x^3 - x - 2`, `1 / (1 + x^2)`). | `"cos(x)"` |
| **`h`** | Step Size | The step increment for numerical integration ($\Delta x$) or ODE time progression. | `0.1`, `0.25` |
| **`n`** | Interval Count | Number of sub-intervals over integration domain $[a, b]$. *Must be EVEN for Simpson's 1/3 rule.* | `6` |
| **`A` & `B`** | Matrix A & RHS B | Matrix of linear coefficients ($A$) and constant right-hand side vector ($B$) for solving $A x = B$. | `A=[[10,-1,2]...]`, `B=[6,25,-11]` |
| **`a` & `b`** | Interval Bounds | Lower limit ($a$) and upper limit ($b$) for definite integration or boundary value domains. | `a=0.0, b=1.0` |
| **`alpha` & `beta`** | Boundary Values | Dirichlet boundary condition values $y(a) = \alpha$ and $y(b) = \beta$ at domain endpoints. | `alpha=0.0, beta=0.0` |
| **`r`** | Mesh Stability Parameter | Crank-Nicolson heat diffusion stability parameter $r = \frac{\alpha \Delta t}{\Delta x^2}$. | `r = 0.5` |

---

## ⌨️ Writing Functions & the Math Keyboard

Every method that takes a function (`f(x)`, `g(x)`, `P(x)`, `Q(x)`, `R(x)`, `g(x, y)`, or an initial condition) shows a **Math Keyboard** panel on the right. Click a function field, then press keys to insert at the cursor (templates like `sqrt(  )` put the cursor inside the brackets). You can also type expressions by hand.

| Keyboard group | Keys | Inserts |
| :--- | :--- | :--- |
| **Calculus** | `d/dx`, `d²/dx²`, `∫ dx`, `∫ₐᵗ`, `Σ`, `lim` | `diff(f, x)`, `diff(f, x, 2)`, `integrate(f, x)`, `integrate(f(t), (t, 0, x))`, `summation(f(k), (k, 1, 10))`, `limit(f, x, 0)` |
| **Roots & powers** | `√`, `∛`, `ⁿ√`, `\|x\|`, `x²`, `x³`, `xⁿ`, `1/x`, `eˣ`, `ln`, `log₁₀`, `log₂` | `sqrt()`, `cbrt()`, `root(x, n)`, `abs()`, `^2`, `^3`, `^()`, `1/()`, `exp()`, `ln()`, `log10()`, `log2()` |
| **Trigonometry** | `sin cos tan sec csc cot`, inverses, `sinh cosh tanh` | `sin()`, …, `asin()`, `acos()`, `atan()`, `sinh()`, … |
| **Constants & variables** | `x`, `y`, `π`, `e`, `( )`, `,` | `x`, `y`, `pi`, `e` (Euler's number) |

**Typing syntax:** `^` is power (`x^3`), implicit multiplication works (`2x` = `2*x`), and `e^x`, `pi`, `ln(x)`, `log10(x)` are all understood. `y` is only meaningful for the ODE solvers and the Poisson source term `g(x, y)`. Calculus expressions are evaluated symbolically first, so for example `diff(x^3, x)` is integrated as `3x²` by Simpson's rule.

---

## 🧮 15 Numerical Methods & Module Reference

### **Module 1: Solution of Equations & Linear Systems**
1. **Fixed-Point Iteration Method** (`POST /api/m1/fixed-point`)
   - Solves $x = g(x)$ iteratively. Outputs step-by-step table $[n, x_n, g(x_n), |x_{n+1} - x_n|]$.
2. **Secant Method** (`POST /api/m1/secant`)
   - Solves $f(x) = 0$ using two initial seeds $x_0, x_1$ without computing derivatives.
3. **Gauss-Seidel Method** (`POST /api/m1/gauss-seidel`)
   - Solves $3 \times 3$ linear systems $Ax = B$ with diagonal dominance check.

### **Module 2: Interpolation & Curve Fitting**
4. **Lagrange's Interpolation** (`POST /api/m2/lagrange-interp`)
   - Evaluates interpolated value $y(x_{eval})$ and reconstructs exact polynomial string $P(x)$.
5. **Lagrange's Inverse Interpolation** (`POST /api/m2/lagrange-inverse`)
   - Predicts $x$ value corresponding to a target $y_{eval}$ when $f(x)$ is unknown.
6. **Least Squares Curve Fitting** (`POST /api/m2/curve-fit`)
   - Fits Linear ($y=ax+b$), Exponential ($y=ae^{bx}$), or Parabolic ($y=ax^2+bx+c$) regression models.

### **Module 3: Numerical Integration & Quadrature**
7. **Simpson's 1/3 Rule** (`POST /api/m3/simpsons`)
   - Parabolic arc composite integration over $n$ intervals ($n$ validated to be even).
8. **Romberg's Integration** (`POST /api/m3/romberg`)
   - High-accuracy Richardson extrapolation lower-triangular tableau $R(j, k)$.
9. **Gauss-Legendre Quadrature** (`POST /api/m3/gauss-quadrature`)
   - 2-Point and 3-Point Gauss quadrature on mapped $[-1, 1]$ interval.

### **Module 4: Initial Value Problems for ODEs**
10. **Modified Euler's Method** (`POST /api/m4/modified-euler`)
    - Predictor-Corrector approach (Heun's method) for $dy/dx = f(x, y)$.
11. **4th-Order Runge-Kutta (RK4)** (`POST /api/m4/rk4`)
    - Industry standard ODE solver returning slope estimators $k_1, k_2, k_3, k_4$.
12. **Taylor's Series Method** (`POST /api/m4/taylor`)
    - Approximates $y(x)$ using higher-order derivatives up to $y^{(4)}(x_0)$.

### **Module 5: Boundary Value Problems & PDEs**
13. **2-Point Linear BVP via Finite Differences** (`POST /api/m5/linear-bvp`)
    - Solves $y'' + P(x)y' + Q(x)y = R(x)$ with boundary conditions $y(a)=\alpha, y(b)=\beta$.
14. **2D Laplace / Poisson Rectangular Solver** (`POST /api/m5/laplace-poisson`)
    - Liebmann grid iteration for $\nabla^2 u = g(x,y)$ with 2D Heatmap visualization.
15. **1D Heat Equation (Crank-Nicolson Implicit Method)** (`POST /api/m5/crank-nicolson`)
    - Unconditionally stable implicit solve for $\frac{\partial u}{\partial t} = \alpha \frac{\partial^2 u}{\partial x^2}$ across time levels.

---

## 🛠️ Installation & Setup Instructions

### **Prerequisites**
- **Python**: 3.11 or higher
- **Node.js**: v18.0 or higher (with `npm`)

### **1. Start the FastAPI Backend**
Open a terminal in the root directory:
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
python -m pip install -r requirements.txt

# Start Uvicorn backend server
uvicorn main:app --host 0.0.0.0 --port 8000
```
*The FastAPI backend will start running at **`http://localhost:8000`**.*

### **2. Start the React Frontend**
Open a **second terminal window**:
```bash
# Navigate to frontend directory
cd frontend

# Install Node modules
npm install

# Launch Vite development server
npm run dev
```
*The React frontend will launch at **`http://localhost:5173`** and proxy API calls to port 8000.*

---

## ✅ Testing & Verification

```bash
cd backend
python -m pytest -q
```

- `test_solvers.py` — smoke tests: all 15 solvers run and give textbook answers.
- `test_verification.py` — strict checks against independent references (SciPy, NumPy, closed-form solutions, exact discrete solutions): expression parsing for every keyboard function, root finders vs `brentq`, Lagrange vs `scipy.interpolate.lagrange`, curve fits vs `np.polyfit`, Simpson/Romberg/Gauss vs `scipy.integrate`, RK4 vs `solve_ivp`, BVP vs analytic solutions, Laplace vs a direct linear solve, Poisson vs a manufactured solution (including non-square grids and y-orientation), and Crank–Nicolson vs the exact discrete decay factor.

---

## 📂 Project Architecture & File Structure

```
Numerical_Methods_Assignment/
├── README.md               # Main project documentation & parameter guide
├── backend/
│   ├── main.py             # FastAPI REST endpoints (15 POST solvers) & CORS configuration
│   ├── solvers.py          # Pure numerical algorithm implementations & SymPy parser
│   ├── requirements.txt    # Python dependencies (fastapi, uvicorn, numpy, scipy, sympy, pydantic)
│   ├── test_solvers.py     # Smoke tests for all 15 numerical algorithms
│   └── test_verification.py # Strict tests against SciPy / NumPy / analytic references
└── frontend/
    ├── vite.config.js      # Vite proxy setup (/api -> http://localhost:8000)
    ├── package.json        # Frontend packages (React, Lucide-React, KaTeX)
    └── src/
        ├── App.jsx         # Main layout with navigation sidebar & precision state
        ├── index.css       # Enterprise slate styling, table grid lines, and field cards
        ├── data/
        │   ├── methodMetadata.js    # Parameter field descriptions, tooltips & output interpreters
        │   └── syllabusExamples.js  # Syllabus example presets for all 15 methods
        └── components/
            ├── Header.jsx       # AWS enterprise topbar & precision selector
            ├── MethodCard.jsx   # Interactive workspace card for parameters & results
            ├── MathKeyboard.jsx # Calculator-style side keyboard for function inputs
            ├── MatrixInput.jsx  # Matrix A & Vector B input grid editor
            ├── HeatmapGrid.jsx  # 2D Heatmap visualization grid for PDEs
            └── LaTeXViewer.jsx  # KaTeX math formula display component
```

---

## 📄 License & Credits
Licensed under the [Apache License 2.0](LICENSE).

Built for **Numerical Methods Assignment** • Powered by **Python, FastAPI, SymPy, NumPy, React, and KaTeX**.
