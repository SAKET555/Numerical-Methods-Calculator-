"""Strict correctness checks: every solver is compared with an independent reference
(closed-form answer, SciPy, or NumPy) rather than the loose ranges in test_solvers.py."""
import math

import numpy as np
import pytest
from scipy import integrate, interpolate, optimize
from scipy.integrate import solve_ivp

import solvers


# ---------------- expression parser (what the math keyboard produces) ----------------

@pytest.mark.parametrize("expr, expected", [
    ("sqrt(x)", math.sqrt(1.5)),
    ("root(x, 3)", 1.5 ** (1 / 3)),
    ("cbrt(x)", 1.5 ** (1 / 3)),
    ("sin(x)", math.sin(1.5)),
    ("cos(x)", math.cos(1.5)),
    ("tan(x)", math.tan(1.5)),
    ("asin(x/2)", math.asin(0.75)),
    ("acos(x/2)", math.acos(0.75)),
    ("atan(x)", math.atan(1.5)),
    ("sinh(x)", math.sinh(1.5)),
    ("cosh(x)", math.cosh(1.5)),
    ("tanh(x)", math.tanh(1.5)),
    ("sec(x)", 1 / math.cos(1.5)),
    ("csc(x)", 1 / math.sin(1.5)),
    ("cot(x)", 1 / math.tan(1.5)),
    ("exp(x)", math.exp(1.5)),
    ("e^x", math.exp(1.5)),
    ("ln(x)", math.log(1.5)),
    ("log10(x)", math.log10(1.5)),
    ("log2(x)", math.log2(1.5)),
    ("abs(x - 3)", 1.5),
    ("pi*x", math.pi * 1.5),
    ("2x", 3.0),
    ("x^2", 2.25),
    ("1/(x)", 1 / 1.5),
    ("diff(sin(x), x)", math.cos(1.5)),
    ("diff(x^3, x, 2)", 6 * 1.5),
    ("diff(exp(x)*sin(x), x)", math.exp(1.5) * (math.sin(1.5) + math.cos(1.5))),
    ("integrate(x^2, x)", 1.5 ** 3 / 3),
    ("integrate(sin(t), (t, 0, x))", 1 - math.cos(1.5)),
    ("integrate(exp(-t^2), (t, 0, 1))", 0.7468241328124271),
    ("summation(k, (k, 1, 10))", 55.0),
    ("limit(sin(x)/x, x, 0)", 1.0),
])
def test_expression_parser(expr, expected):
    f, _ = solvers.parse_sympy_func(expr)
    assert float(f(1.5)) == pytest.approx(expected, rel=1e-10, abs=1e-12)


def test_parser_two_variables():
    f, _ = solvers.parse_sympy_func("x*y + diff(y^3, y) + sqrt(x)", ["x", "y"])
    assert float(f(4.0, 2.0)) == pytest.approx(8 + 12 + 2)


# ---------------- Module 1 ----------------

def test_fixed_point():
    r = solvers.fixed_point_solver("cos(x)", 0.5, 1e-10, 200)
    assert r["converged"]
    assert r["root"] == pytest.approx(0.7390851332151607, abs=1e-8)
    assert r["iterations"][0]["g_xn"] == pytest.approx(math.cos(0.5))


def test_secant():
    r = solvers.secant_solver("x^3 - x - 2", 1.0, 2.0, 1e-12, 50)
    ref = optimize.brentq(lambda x: x**3 - x - 2, 1, 2, xtol=1e-14)
    assert r["converged"] and r["root"] == pytest.approx(ref, abs=1e-10)


def test_secant_with_keyboard_functions():
    r = solvers.secant_solver("e^x - 3*x", 0.0, 1.0, 1e-12, 50)
    ref = optimize.brentq(lambda x: math.exp(x) - 3 * x, 0, 1)
    assert r["root"] == pytest.approx(ref, abs=1e-9)


def test_gauss_seidel():
    A = [[10, -1, 2], [-1, 11, -1], [2, -1, 10]]
    B = [6, 25, -11]
    r = solvers.gauss_seidel_solver(A, B, [0, 0, 0], 1e-12, 200)
    assert r["is_diagonally_dominant"] and r["converged"]
    assert r["solution"] == pytest.approx(np.linalg.solve(A, B), abs=1e-9)


# ---------------- Module 2 ----------------

def test_lagrange_interpolation():
    xs, ys = [5, 6, 9, 11], [12, 13, 14, 16]
    r = solvers.lagrange_interp_solver(xs, ys, 10)
    ref = interpolate.lagrange(xs, ys)(10)
    assert r["y_eval"] == pytest.approx(ref, abs=1e-10)
    # reconstructed polynomial string must reproduce the same value
    f, _ = solvers.parse_sympy_func(r["polynomial_str"])
    assert float(f(10)) == pytest.approx(ref, abs=1e-8)


def test_lagrange_inverse():
    xs, ys = [2, 5, 8, 14], [94.8, 87.9, 81.3, 68.7]
    r = solvers.lagrange_inverse_solver(xs, ys, 85.0)
    ref = interpolate.lagrange(ys, xs)(85.0)
    assert r["x_eval"] == pytest.approx(ref, abs=1e-8)


def test_least_squares_linear():
    xs, ys = [1, 2, 3, 4, 5], [0.5, 2.5, 2.0, 4.0, 3.5]
    r = solvers.least_squares_fit_solver(xs, ys, "linear")
    a, b = np.polyfit(xs, ys, 1)
    assert r["coefficients"]["a"] == pytest.approx(a) and r["coefficients"]["b"] == pytest.approx(b)


def test_least_squares_parabolic():
    xs, ys = [0, 1, 2, 3, 4, 5], [1.1, 1.9, 5.2, 9.8, 17.1, 26.0]
    r = solvers.least_squares_fit_solver(xs, ys, "parabolic")
    ref = np.polyfit(xs, ys, 2)
    c = r["coefficients"]
    assert [c["a"], c["b"], c["c"]] == pytest.approx(list(ref))


def test_least_squares_exponential():
    xs, ys = [0, 1, 2, 3, 4], [1.0, 2.7, 7.4, 20.1, 54.6]
    r = solvers.least_squares_fit_solver(xs, ys, "exponential")
    b, ln_a = np.polyfit(xs, np.log(ys), 1)
    assert r["coefficients"]["b"] == pytest.approx(b)
    assert r["coefficients"]["a"] == pytest.approx(math.exp(ln_a))


# ---------------- Module 3 ----------------

def test_simpson():
    r = solvers.simpsons_13_solver("sin(x)", 0.0, math.pi, 100)
    ref = integrate.simpson(np.sin(np.linspace(0, math.pi, 101)), x=np.linspace(0, math.pi, 101))
    assert r["integral"] == pytest.approx(ref, abs=1e-12)
    assert r["integral"] == pytest.approx(2.0, abs=1e-6)


def test_simpson_syllabus_example():
    # 1/(1+x^2) on [0, 6], n = 6 -> textbook value 1.3662
    r = solvers.simpsons_13_solver("1 / (1 + x^2)", 0.0, 6.0, 6)
    assert r["integral"] == pytest.approx(1.3662, abs=1e-4)


def test_simpson_rejects_odd_n():
    with pytest.raises(ValueError):
        solvers.simpsons_13_solver("x", 0, 1, 5)


def test_romberg():
    r = solvers.romberg_solver("1 / (1 + x)", 0.0, 1.0, 6)
    assert r["integral"] == pytest.approx(math.log(2), abs=1e-9)
    # first column is the trapezoid rule: T1 = 0.75
    assert r["tableau"][0][0] == pytest.approx(0.75)
    assert r["tableau"][1][0] == pytest.approx(0.7083333333, abs=1e-9)


def test_romberg_transcendental():
    r = solvers.romberg_solver("exp(-x^2)", 0.0, 1.0, 6)
    ref, _ = integrate.quad(lambda x: math.exp(-x * x), 0, 1)
    assert r["integral"] == pytest.approx(ref, abs=1e-9)


@pytest.mark.parametrize("n_points", [2, 3])
def test_gauss_quadrature_exact_for_polynomials(n_points):
    # n-point Gauss-Legendre is exact up to degree 2n-1
    r = solvers.gauss_quadrature_solver("x^3 + 2*x^2 + 1", 0.0, 2.0, n_points)
    assert r["integral"] == pytest.approx(4 + 16 / 3 + 2)


def test_gauss_quadrature_3pt_transcendental():
    r = solvers.gauss_quadrature_solver("sin(x)", 0.0, math.pi / 2, 3)
    ref, _ = integrate.fixed_quad(np.sin, 0, math.pi / 2, n=3)
    assert r["integral"] == pytest.approx(ref, abs=1e-12)


# ---------------- Module 4 ----------------

def test_modified_euler_first_step():
    # y' = x + y, y(0) = 1, h = 0.1: predictor 1.1; corrector fixed point solves
    # y1 = 1 + 0.05 * (1 + (0.1 + y1))  ->  y1 = 1.055 / 0.95
    r = solvers.modified_euler_solver("x + y", 0.0, 1.0, 0.1, 0.5)
    assert r["steps"][0]["y_pred"] == pytest.approx(1.1)
    assert r["steps"][0]["y_next"] == pytest.approx(1.055 / 0.95, abs=1e-6)
    exact = 2 * math.exp(0.5) - 0.5 - 1  # y = 2e^x - x - 1
    assert r["final_y"] == pytest.approx(exact, abs=5e-3)


def test_rk4_matches_scipy():
    sol = solve_ivp(lambda x, y: x**2 + y**2, (0, 0.2), [1.0], rtol=1e-12, atol=1e-13)
    # RK4 global error is O(h^4): tight at h = 0.01, ~1e-6 at the syllabus step h = 0.1
    assert solvers.rk4_solver("x^2 + y^2", 0.0, 1.0, 0.01, 0.2)["final_y"] == pytest.approx(sol.y[0, -1], abs=1e-9)
    assert solvers.rk4_solver("x^2 + y^2", 0.0, 1.0, 0.1, 0.2)["final_y"] == pytest.approx(sol.y[0, -1], abs=1e-5)
    # hand-computed first step of the syllabus example
    s0 = solvers.rk4_solver("x^2 + y^2", 0.0, 1.0, 0.1, 0.1)["steps"][0]
    assert s0["k1"] == pytest.approx(1.0)
    assert s0["k2"] == pytest.approx(0.05**2 + 1.05**2)


def test_rk4_exponential_growth():
    r = solvers.rk4_solver("y", 0.0, 1.0, 0.1, 1.0)
    assert r["final_y"] == pytest.approx(math.e, abs=1e-5)


def test_taylor():
    # y = e^x: every derivative is 1 at x0 = 0
    r = solvers.taylor_solver(0.0, 1.0, 0.1, {"y1": 1, "y2": 1, "y3": 1, "y4": 1})
    assert r["final_y"] == pytest.approx(1 + 0.1 + 0.005 + 0.1**3 / 6 + 0.1**4 / 24)
    assert r["final_y"] == pytest.approx(math.exp(0.1), abs=1e-6)


# ---------------- Module 5 ----------------

def test_linear_bvp_against_analytic():
    # y'' + y = 0, y(0) = 0, y(1) = sin(1)  ->  y = sin(x)
    r = solvers.linear_bvp_solver("0", "1", "0", 0.0, 1.0, 0.0, math.sin(1.0), 0.01)
    assert r["y_values"] == pytest.approx([math.sin(x) for x in r["x_grid"]], abs=1e-5)


def test_linear_bvp_with_first_derivative_term():
    # y'' - y = 0, y(0) = 1, y(1) = e  ->  y = e^x
    r = solvers.linear_bvp_solver("0", "-1", "0", 0.0, 1.0, 1.0, math.e, 0.01)
    assert r["y_values"] == pytest.approx([math.exp(x) for x in r["x_grid"]], abs=1e-4)
    # y'' - y' = 0, y(0) = 1, y(1) = e  ->  y = e^x
    r = solvers.linear_bvp_solver("-1", "0", "0", 0.0, 1.0, 1.0, math.e, 0.01)
    assert r["y_values"] == pytest.approx([math.exp(x) for x in r["x_grid"]], abs=1e-4)


def test_laplace_matches_direct_solve():
    n = 8
    top, bottom, left, right = 100.0, 0.0, 75.0, 50.0
    r = solvers.laplace_poisson_solver(n, n, top, bottom, left, right, "0", max_iter=5000, tol=1e-10)
    assert r["converged"]
    # independent solve of the 5-point Laplace system
    m = n - 2
    A = np.zeros((m * m, m * m))
    b = np.zeros(m * m)
    grid = np.zeros((n, n))
    grid[0, :], grid[-1, :], grid[:, 0], grid[:, -1] = top, bottom, left, right
    for i in range(1, n - 1):
        for j in range(1, n - 1):
            k = (i - 1) * m + (j - 1)
            A[k, k] = 4
            for di, dj in ((-1, 0), (1, 0), (0, -1), (0, 1)):
                ii, jj = i + di, j + dj
                if 0 < ii < n - 1 and 0 < jj < n - 1:
                    A[k, (ii - 1) * m + (jj - 1)] = -1
                else:
                    b[k] += grid[ii, jj]
    ref = np.linalg.solve(A, b).reshape(m, m)
    assert np.array(r["grid"])[1:-1, 1:-1] == pytest.approx(ref, abs=1e-6)


def test_poisson_with_source_term():
    # u_xx + u_yy = -2 pi^2 sin(pi x) sin(pi y) on the unit square, u = 0 on the boundary
    # exact solution: u = sin(pi x) sin(pi y)
    n = 21
    r = solvers.laplace_poisson_solver(n, n, 0, 0, 0, 0, "-2*pi^2*sin(pi*x)*sin(pi*y)", max_iter=20000, tol=1e-10)
    grid = np.array(r["grid"])
    xs = np.linspace(0, 1, n)
    exact = np.outer(np.sin(np.pi * xs), np.sin(np.pi * xs))
    assert grid == pytest.approx(exact, abs=5e-3)


def test_poisson_y_orientation():
    # Manufactured solution u = sin(pi x) * y^2 * (1 - y) is zero on the whole boundary and NOT
    # symmetric in y, so a flipped y axis in the source term g(x, y) gives a clearly wrong answer.
    n = 21
    g = "-pi^2*sin(pi*x)*y^2*(1 - y) + sin(pi*x)*(2 - 6*y)"
    r = solvers.laplace_poisson_solver(n, n, 0, 0, 0, 0, g, max_iter=20000, tol=1e-11)
    xs = np.linspace(0, 1, n)
    ys_top_down = np.linspace(1, 0, n)  # row 0 is the top boundary (y = 1)
    exact = np.outer(ys_top_down**2 * (1 - ys_top_down), np.sin(np.pi * xs))
    assert np.array(r["grid"]) == pytest.approx(exact, abs=2e-3)


def test_poisson_non_square_grid():
    # Nx != Ny means hx != hy; the stencil weights must account for that.
    nx, ny = 41, 21
    g = "-pi^2*sin(pi*x)*y^2*(1 - y) + sin(pi*x)*(2 - 6*y)"
    r = solvers.laplace_poisson_solver(nx, ny, 0, 0, 0, 0, g, max_iter=50000, tol=1e-11)
    xs, ys = np.linspace(0, 1, nx), np.linspace(1, 0, ny)
    exact = np.outer(ys**2 * (1 - ys), np.sin(np.pi * xs))
    assert np.array(r["grid"]) == pytest.approx(exact, abs=2e-3)


def test_crank_nicolson_heat_equation():
    dx, dt, steps = 0.05, 0.001, 50
    r = solvers.crank_nicolson_solver(1.0, dx, dt, steps, 1.0, "sin(pi*x)", 0.0, 0.0)
    x = np.array(r["x_grid"])
    u = np.array(r["time_levels"][-1]["u_values"])
    assert r["r_param"] == pytest.approx(0.4)
    # sin(pi x) is an eigenvector of the discrete Laplacian, so Crank-Nicolson multiplies it
    # by exactly (1 - lam*dt/2) / (1 + lam*dt/2) each step: an exact check of the scheme.
    lam = 4 / dx**2 * math.sin(math.pi * dx / 2) ** 2
    factor = ((1 - lam * dt / 2) / (1 + lam * dt / 2)) ** steps
    assert u == pytest.approx(factor * np.sin(math.pi * x), abs=1e-10)
    # and it agrees with the PDE's analytic solution up to the O(dx^2) space error
    t = r["time_levels"][-1]["t"]
    assert u == pytest.approx(np.exp(-math.pi**2 * t) * np.sin(math.pi * x), abs=2e-3)
