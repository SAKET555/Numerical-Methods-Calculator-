import math
import numpy as np
import sympy as sp
from sympy.parsing.sympy_parser import (
    parse_expr,
    standard_transformations,
    implicit_multiplication_application,
    convert_xor
)

# Safe expression evaluation helper
def parse_sympy_func(expr_str, vars_list=('x',)):
    """
    Parses string math expression to executable python function using SymPy.
    Supports ^ for power, implicit multiplication (e.g. 2x -> 2*x), sin, cos, exp, etc.
    """
    transformations = standard_transformations + (implicit_multiplication_application, convert_xor)
    symbols = [sp.Symbol(v) for v in vars_list]
    parsed = parse_expr(expr_str, transformations=transformations)
    
    # modules=['numpy', 'math'] for mathematical functions
    func = sp.lambdify(symbols, parsed, modules=['numpy', {'exp': np.exp, 'e': math.e, 'ln': np.log}])
    return func, parsed

# ---------------------------------------------------------
# MODULE 1: Solution of Equations & Linear Systems
# ---------------------------------------------------------

def fixed_point_solver(g_expr: str, x0: float, tol: float, max_iter: int):
    g_func, _ = parse_sympy_func(g_expr, ['x'])
    iterations = []
    x_curr = x0
    converged = False
    
    for n in range(max_iter):
        try:
            g_val = float(g_func(x_curr))
        except Exception as e:
            raise ValueError(f"Error evaluating g(x) at x={x_curr}: {str(e)}")
            
        diff = abs(g_val - x_curr)
        iterations.append({
            "n": n,
            "x_n": x_curr,
            "g_xn": g_val,
            "diff": diff
        })
        
        if diff < tol:
            converged = True
            x_curr = g_val
            break
        x_curr = g_val
        
    return {
        "iterations": iterations,
        "converged": converged,
        "root": x_curr,
        "total_iters": len(iterations)
    }

def secant_solver(f_expr: str, x0: float, x1: float, tol: float, max_iter: int):
    f_func, _ = parse_sympy_func(f_expr, ['x'])
    iterations = []
    x_prev = x0
    x_curr = x1
    converged = False
    
    for n in range(1, max_iter + 1):
        f_prev = float(f_func(x_prev))
        f_curr = float(f_func(x_curr))
        
        denom = f_curr - f_prev
        if abs(denom) < 1e-14:
            raise ValueError("Secant method failed due to zero division (f(x_n) - f(x_{n-1}) ≈ 0)")
            
        x_next = x_curr - f_curr * (x_curr - x_prev) / denom
        error = abs(x_next - x_curr)
        
        iterations.append({
            "n": n,
            "x_prev": x_prev,
            "x_curr": x_curr,
            "f_curr": f_curr,
            "x_next": x_next,
            "error": error
        })
        
        if error < tol:
            converged = True
            x_curr = x_next
            break
            
        x_prev = x_curr
        x_curr = x_next
        
    return {
        "iterations": iterations,
        "converged": converged,
        "root": x_curr,
        "total_iters": len(iterations)
    }

def gauss_seidel_solver(A: list, B: list, x0: list, tol: float, max_iter: int):
    A_np = np.array(A, dtype=float)
    B_np = np.array(B, dtype=float)
    n = len(B)
    
    # Diagonal dominance check
    is_diagonally_dominant = True
    for i in range(n):
        diag = abs(A_np[i, i])
        off_diag = sum(abs(A_np[i, j]) for j in range(n) if j != i)
        if diag < off_diag:
            is_diagonally_dominant = False
            break
            
    x_curr = np.array(x0, dtype=float)
    iterations = []
    converged = False
    
    for k in range(1, max_iter + 1):
        x_new = np.copy(x_curr)
        for i in range(n):
            s1 = sum(A_np[i, j] * x_new[j] for j in range(i))
            s2 = sum(A_np[i, j] * x_curr[j] for j in range(i + 1, n))
            if abs(A_np[i, i]) < 1e-14:
                raise ValueError(f"Zero diagonal element found at A[{i}][{i}]")
            x_new[i] = (B_np[i] - s1 - s2) / A_np[i, i]
            
        diff = np.max(np.abs(x_new - x_curr))
        iterations.append({
            "iter": k,
            "x_vector": x_new.tolist(),
            "error": float(diff)
        })
        
        x_curr = x_new
        if diff < tol:
            converged = True
            break
            
    return {
        "is_diagonally_dominant": is_diagonally_dominant,
        "iterations": iterations,
        "converged": converged,
        "solution": x_curr.tolist(),
        "total_iters": len(iterations)
    }


# ---------------------------------------------------------
# MODULE 2: Interpolation & Curve Fitting
# ---------------------------------------------------------

def lagrange_interp_solver(x_points: list, y_points: list, x_eval: float):
    n = len(x_points)
    if n != len(y_points):
        raise ValueError("x_points and y_points must have the same length")
        
    basis_terms = []
    y_eval = 0.0
    
    # Reconstruct polynomial string symbolically using SymPy
    x_sym = sp.Symbol('x')
    poly_sym = 0
    
    for i in range(n):
        l_num = 1.0
        l_den = 1.0
        l_sym = 1
        for j in range(n):
            if i != j:
                l_num *= (x_eval - x_points[j])
                l_den *= (x_points[i] - x_points[j])
                l_sym *= (x_sym - x_points[j]) / (x_points[i] - x_points[j])
                
        l_i_val = l_num / l_den
        term_val = y_points[i] * l_i_val
        y_eval += term_val
        poly_sym += y_points[i] * l_sym
        
        basis_terms.append({
            "i": i,
            "x_i": x_points[i],
            "y_i": y_points[i],
            "L_i_val": l_i_val,
            "term_contribution": term_val
        })
        
    simplified_poly = sp.simplify(poly_sym)
    
    return {
        "y_eval": float(y_eval),
        "basis_terms": basis_terms,
        "polynomial_str": str(simplified_poly)
    }

def lagrange_inverse_solver(x_points: list, y_points: list, y_eval: float):
    # Inverse interpolation swaps x and y roles
    res = lagrange_interp_solver(y_points, x_points, y_eval)
    return {
        "x_eval": res["y_eval"],
        "basis_terms": res["basis_terms"],
        "polynomial_str": res["polynomial_str"].replace('x', 'y')
    }

def least_squares_fit_solver(x_points: list, y_points: list, model_type: str):
    x = np.array(x_points, dtype=float)
    y = np.array(y_points, dtype=float)
    n = len(x)
    
    if n != len(y):
        raise ValueError("x and y arrays must have identical length")
        
    if model_type == "linear":
        # y = a*x + b  (or y = A x + B)
        sum_x = float(np.sum(x))
        sum_y = float(np.sum(y))
        sum_x2 = float(np.sum(x**2))
        sum_xy = float(np.sum(x * y))
        
        A_mat = [[sum_x2, sum_x], [sum_x, n]]
        B_vec = [sum_xy, sum_y]
        
        a, b = np.linalg.solve(A_mat, B_vec)
        
        return {
            "model_type": model_type,
            "coefficients": {"a": float(a), "b": float(b)},
            "equation_str": f"y = {a:.6f}*x + ({b:.6f})",
            "normal_matrix": A_mat,
            "normal_vector": B_vec,
            "intermediate_sums": {
                "N": n, "sum_x": sum_x, "sum_y": sum_y, "sum_x2": sum_x2, "sum_xy": sum_xy
            }
        }
        
    elif model_type == "exponential":
        # y = a * e^(b*x) => ln(y) = ln(a) + b*x => Y = B0 + B1*x where Y=ln(y), B0=ln(a), B1=b
        if np.any(y <= 0):
            raise ValueError("All y values must be positive for exponential fit")
            
        Y = np.log(y)
        sum_x = float(np.sum(x))
        sum_Y = float(np.sum(Y))
        sum_x2 = float(np.sum(x**2))
        sum_xY = float(np.sum(x * Y))
        
        A_mat = [[sum_x2, sum_x], [sum_x, n]]
        B_vec = [sum_xY, sum_Y]
        
        b, ln_a = np.linalg.solve(A_mat, B_vec)
        a = math.exp(ln_a)
        
        return {
            "model_type": model_type,
            "coefficients": {"a": float(a), "b": float(b)},
            "equation_str": f"y = {a:.6f} * e^({b:.6f}*x)",
            "normal_matrix": A_mat,
            "normal_vector": B_vec,
            "intermediate_sums": {
                "N": n, "sum_x": sum_x, "sum_Y(ln_y)": sum_Y, "sum_x2": sum_x2, "sum_xY": sum_xY
            }
        }
        
    elif model_type == "parabolic":
        # y = a*x^2 + b*x + c
        sum_x = float(np.sum(x))
        sum_y = float(np.sum(y))
        sum_x2 = float(np.sum(x**2))
        sum_x3 = float(np.sum(x**3))
        sum_x4 = float(np.sum(x**4))
        sum_xy = float(np.sum(x * y))
        sum_x2y = float(np.sum((x**2) * y))
        
        A_mat = [
            [sum_x4, sum_x3, sum_x2],
            [sum_x3, sum_x2, sum_x],
            [sum_x2, sum_x, n]
        ]
        B_vec = [sum_x2y, sum_xy, sum_y]
        
        a, b, c = np.linalg.solve(A_mat, B_vec)
        
        return {
            "model_type": model_type,
            "coefficients": {"a": float(a), "b": float(b), "c": float(c)},
            "equation_str": f"y = {a:.6f}*x^2 + ({b:.6f})*x + ({c:.6f})",
            "normal_matrix": A_mat,
            "normal_vector": B_vec,
            "intermediate_sums": {
                "N": n, "sum_x": sum_x, "sum_y": sum_y, "sum_x2": sum_x2,
                "sum_x3": sum_x3, "sum_x4": sum_x4, "sum_xy": sum_xy, "sum_x2y": sum_x2y
            }
        }
    else:
        raise ValueError(f"Unsupported model_type: {model_type}")


# ---------------------------------------------------------
# MODULE 3: Numerical Integration & Quadrature
# ---------------------------------------------------------

def simpsons_13_solver(f_expr: str, a: float, b: float, n: int):
    if n % 2 != 0:
        raise ValueError("Interval count 'n' must be an even integer for Simpson's 1/3 rule.")
        
    f_func, _ = parse_sympy_func(f_expr, ['x'])
    h = (b - a) / n
    grid = []
    
    total_sum = 0.0
    for i in range(n + 1):
        x_i = a + i * h
        f_val = float(f_func(x_i))
        
        if i == 0 or i == n:
            weight = 1
        elif i % 2 == 1:
            weight = 4
        else:
            weight = 2
            
        term = weight * f_val
        total_sum += term
        
        grid.append({
            "i": i,
            "x_i": x_i,
            "f_xi": f_val,
            "weight": weight,
            "term": term
        })
        
    integral = (h / 3.0) * total_sum
    return {
        "h": h,
        "grid": grid,
        "integral": float(integral)
    }

def romberg_solver(f_expr: str, a: float, b: float, k: int):
    f_func, _ = parse_sympy_func(f_expr, ['x'])
    R = np.zeros((k, k), dtype=float)
    
    # R(0,0) Trapezoidal rule with 1 segment
    h = b - a
    R[0, 0] = 0.5 * h * (float(f_func(a)) + float(f_func(b)))
    
    for i in range(1, k):
        h = (b - a) / (2**i)
        # Sum f(a + (2j - 1)h) for j = 1..2^(i-1)
        num_points = 2**(i - 1)
        sum_f = sum(float(f_func(a + (2*j - 1) * h)) for j in range(1, num_points + 1))
        
        R[i, 0] = 0.5 * R[i-1, 0] + h * sum_f
        
        # Richardson extrapolation
        for j in range(1, i + 1):
            R[i, j] = R[i, j-1] + (R[i, j-1] - R[i-1, j-1]) / (4**j - 1)
            
    tableau = R.tolist()
    return {
        "k": k,
        "tableau": tableau,
        "integral": float(R[k-1, k-1])
    }

def gauss_quadrature_solver(f_expr: str, a: float, b: float, n_points: int):
    f_func, _ = parse_sympy_func(f_expr, ['x'])
    
    if n_points == 2:
        t_nodes = [-1.0 / math.sqrt(3.0), 1.0 / math.sqrt(3.0)]
        weights = [1.0, 1.0]
    elif n_points == 3:
        t_nodes = [-math.sqrt(3.0 / 5.0), 0.0, math.sqrt(3.0 / 5.0)]
        weights = [5.0 / 9.0, 8.0 / 9.0, 5.0 / 9.0]
    else:
        raise ValueError("n_points must be 2 or 3 for Gauss Quadrature.")
        
    evaluations = []
    integral_sum = 0.0
    
    # x = (b-a)/2 * t + (a+b)/2
    # dx = (b-a)/2 dt
    half_diff = (b - a) / 2.0
    half_sum = (a + b) / 2.0
    
    for t, w in zip(t_nodes, weights):
        x_mapped = half_diff * t + half_sum
        f_val = float(f_func(x_mapped))
        term = w * f_val
        integral_sum += term
        
        evaluations.append({
            "t_node": t,
            "x_mapped": x_mapped,
            "weight": w,
            "f_val": f_val,
            "term": term
        })
        
    integral = half_diff * integral_sum
    transformed_expr_str = f"x(t) = {half_diff:.6f}*t + {half_sum:.6f}"
    
    return {
        "n_points": n_points,
        "transformed_expr": transformed_expr_str,
        "evaluations": evaluations,
        "integral": float(integral)
    }


# ---------------------------------------------------------
# MODULE 4: Initial Value Problems for ODEs
# ---------------------------------------------------------

def modified_euler_solver(f_expr: str, x0: float, y0: float, h: float, x_end: float, max_corrections: int = 5):
    f_func, _ = parse_sympy_func(f_expr, ['x', 'y'])
    
    steps = []
    x_curr = x0
    y_curr = y0
    step_count = int(round((x_end - x0) / h))
    
    for n in range(step_count):
        f_curr = float(f_func(x_curr, y_curr))
        y_pred = y_curr + h * f_curr
        x_next = x_curr + h
        
        # Corrector iterations
        y_corr = y_pred
        corrections_log = []
        for c in range(max_corrections):
            f_next = float(f_func(x_next, y_corr))
            y_new = y_curr + (h / 2.0) * (f_curr + f_next)
            err = abs(y_new - y_corr)
            corrections_log.append(y_new)
            y_corr = y_new
            if err < 1e-7:
                break
                
        steps.append({
            "step": n + 1,
            "x_n": x_curr,
            "y_n": y_curr,
            "y_pred": y_pred,
            "y_next": y_corr,
            "x_next": x_next
        })
        
        x_curr = x_next
        y_curr = y_corr
        
    return {
        "steps": steps,
        "final_x": x_curr,
        "final_y": y_curr
    }

def rk4_solver(f_expr: str, x0: float, y0: float, h: float, x_end: float):
    f_func, _ = parse_sympy_func(f_expr, ['x', 'y'])
    
    steps = []
    x_curr = x0
    y_curr = y0
    step_count = int(round((x_end - x0) / h))
    
    for n in range(step_count):
        k1 = float(f_func(x_curr, y_curr))
        k2 = float(f_func(x_curr + 0.5 * h, y_curr + 0.5 * h * k1))
        k3 = float(f_func(x_curr + 0.5 * h, y_curr + 0.5 * h * k2))
        k4 = float(f_func(x_curr + h, y_curr + h * k3))
        
        y_next = y_curr + (h / 6.0) * (k1 + 2*k2 + 2*k3 + k4)
        x_next = x_curr + h
        
        steps.append({
            "step": n + 1,
            "x_n": x_curr,
            "y_n": y_curr,
            "k1": k1,
            "k2": k2,
            "k3": k3,
            "k4": k4,
            "y_next": y_next,
            "x_next": x_next
        })
        
        x_curr = x_next
        y_curr = y_next
        
    return {
        "steps": steps,
        "final_x": x_curr,
        "final_y": y_curr
    }

def taylor_solver(x0: float, y0: float, x_eval: float, derivatives: dict):
    # derivatives = {'y1': float, 'y2': float, 'y3': float, 'y4': float}
    h = x_eval - x0
    
    # y(x) = y0 + h*y' + (h^2/2!)y'' + (h^3/3!)y''' + (h^4/4!)y''''
    terms = [
        {"order": 0, "derivative_val": y0, "term_val": y0},
        {"order": 1, "derivative_val": derivatives.get('y1', 0.0), "term_val": h * derivatives.get('y1', 0.0)},
        {"order": 2, "derivative_val": derivatives.get('y2', 0.0), "term_val": (h**2 / 2.0) * derivatives.get('y2', 0.0)},
        {"order": 3, "derivative_val": derivatives.get('y3', 0.0), "term_val": (h**3 / 6.0) * derivatives.get('y3', 0.0)},
        {"order": 4, "derivative_val": derivatives.get('y4', 0.0), "term_val": (h**4 / 24.0) * derivatives.get('y4', 0.0)},
    ]
    
    final_sum = sum(t["term_val"] for t in terms)
    
    return {
        "h": h,
        "terms": terms,
        "final_y": final_sum
    }


# ---------------------------------------------------------
# MODULE 5: Boundary Value Problems & PDEs
# ---------------------------------------------------------

def linear_bvp_solver(P_expr: str, Q_expr: str, R_expr: str, a: float, b: float, alpha: float, beta: float, h: float):
    # y'' + P(x)y' + Q(x)y = R(x)
    P_func, _ = parse_sympy_func(P_expr, ['x'])
    Q_func, _ = parse_sympy_func(Q_expr, ['x'])
    R_func, _ = parse_sympy_func(R_expr, ['x'])
    
    N = int(round((b - a) / h))
    if N < 2:
        raise ValueError("Step size h is too large relative to interval [a, b]")
        
    m = N - 1 # interior points
    x_nodes = [a + i*h for i in range(1, N)]
    
    A = np.zeros((m, m), dtype=float)
    B = np.zeros(m, dtype=float)
    
    for i in range(m):
        xi = x_nodes[i]
        Pi = float(P_func(xi))
        Qi = float(Q_func(xi))
        Ri = float(R_func(xi))
        
        sub_diag = 1.0 - (h / 2.0) * Pi
        main_diag = -2.0 + (h**2) * Qi
        super_diag = 1.0 + (h / 2.0) * Pi
        
        rhs = (h**2) * Ri
        
        A[i, i] = main_diag
        if i > 0:
            A[i, i-1] = sub_diag
        else:
            rhs -= sub_diag * alpha # boundary at a
            
        if i < m - 1:
            A[i, i+1] = super_diag
        else:
            rhs -= super_diag * beta # boundary at b
            
        B[i] = rhs
        
    y_interior = np.linalg.solve(A, B)
    
    full_x = [a] + x_nodes + [b]
    full_y = [alpha] + y_interior.tolist() + [beta]
    
    return {
        "A_matrix": A.tolist(),
        "B_vector": B.tolist(),
        "x_grid": full_x,
        "y_values": full_y,
        "interior_count": m
    }

def laplace_poisson_solver(Nx: int, Ny: int, top: float, bottom: float, left: float, right: float, g_expr: str = "0", max_iter: int = 500, tol: float = 1e-5):
    g_func, _ = parse_sympy_func(g_expr, ['x', 'y'])
    
    # Ny rows, Nx columns
    grid = np.zeros((Ny, Nx), dtype=float)
    
    # Set boundary conditions
    grid[0, :] = top
    grid[-1, :] = bottom
    grid[:, 0] = left
    grid[:, -1] = right
    
    # Initialize interior with average of boundaries
    avg_val = (top + bottom + left + right) / 4.0
    grid[1:-1, 1:-1] = avg_val
    
    hx = 1.0 / (Nx - 1)
    hy = 1.0 / (Ny - 1)
    h2 = hx * hy
    
    converged = False
    for it in range(max_iter):
        diff = 0.0
        for i in range(1, Ny - 1):
            for j in range(1, Nx - 1):
                old_val = grid[i, j]
                g_val = float(g_func(j * hx, i * hy))
                new_val = 0.25 * (grid[i-1, j] + grid[i+1, j] + grid[i, j-1] + grid[i, j+1] - h2 * g_val)
                grid[i, j] = new_val
                diff = max(diff, abs(new_val - old_val))
                
        if diff < tol:
            converged = True
            break
            
    return {
        "grid": grid.tolist(),
        "Nx": Nx,
        "Ny": Ny,
        "converged": converged,
        "total_iters": it + 1
    }

def crank_nicolson_solver(alpha: float, dx: float, dt: float, t_steps: int, L: float, u_ic_str: str, u_left: float, u_right: float):
    r = alpha * dt / (dx ** 2)
    
    Nx = int(round(L / dx)) + 1
    m = Nx - 2 # interior points
    if m < 1:
        raise ValueError("dx is too large for domain L")
        
    x_grid = [i * dx for i in range(Nx)]
    
    # Parse initial condition
    u_ic_func, _ = parse_sympy_func(u_ic_str if u_ic_str else "0", ['x'])
    u_curr = np.array([float(u_ic_func(x)) for x in x_grid], dtype=float)
    u_curr[0] = u_left
    u_curr[-1] = u_right
    
    # Construct LHS tridiagonal matrix A
    A = np.zeros((m, m), dtype=float)
    for i in range(m):
        A[i, i] = 1.0 + r
        if i > 0:
            A[i, i-1] = -r / 2.0
        if i < m - 1:
            A[i, i+1] = -r / 2.0
            
    time_levels = [{"t": 0.0, "u_values": u_curr.tolist()}]
    
    for step in range(1, t_steps + 1):
        # Construct RHS vector B
        B = np.zeros(m, dtype=float)
        for i in range(m):
            idx = i + 1 # interior index in u_curr
            B[i] = (r / 2.0) * u_curr[idx - 1] + (1.0 - r) * u_curr[idx] + (r / 2.0) * u_curr[idx + 1]
            
        # Boundary adjustments
        B[0] += (r / 2.0) * u_left
        B[-1] += (r / 2.0) * u_right
        
        u_interior = np.linalg.solve(A, B)
        u_next = np.zeros(Nx, dtype=float)
        u_next[0] = u_left
        u_next[-1] = u_right
        u_next[1:-1] = u_interior
        
        time_levels.append({
            "t": step * dt,
            "u_values": u_next.tolist()
        })
        u_curr = u_next
        
    return {
        "r_param": r,
        "x_grid": x_grid,
        "time_levels": time_levels
    }
