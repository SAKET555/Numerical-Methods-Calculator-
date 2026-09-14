import solvers

def test_all():
    print("Testing 15 Numerical Solvers...")

    # M1
    r1 = solvers.fixed_point_solver("cos(x)", 0.5, 1e-5, 50)
    assert r1["converged"] and abs(r1["root"] - 0.739085) < 1e-3, f"M1 Fixed-Point Failed: {r1}"
    print("[PASS] 1. Fixed-Point Iteration")

    r2 = solvers.secant_solver("x^3 - x - 2", 1.0, 2.0, 1e-6, 30)
    assert r2["converged"] and abs(r2["root"] - 1.5213797) < 1e-3, f"M1 Secant Failed: {r2}"
    print("[PASS] 2. Secant Method")

    r3 = solvers.gauss_seidel_solver([[10, -1, 2], [-1, 11, -1], [2, -1, 10]], [6, 25, -11], [0, 0, 0], 1e-6, 30)
    assert r3["converged"] and abs(r3["solution"][0] - 1.043269) < 1e-3, f"M1 Gauss-Seidel Failed: {r3}"
    print("[PASS] 3. Gauss-Seidel Method")

    # M2
    r4 = solvers.lagrange_interp_solver([5, 6, 9, 11], [12, 13, 14, 16], 10)
    assert abs(r4["y_eval"] - 14.6666) < 1e-2, f"M2 Lagrange Interp Failed: {r4}"
    print("[PASS] 4. Lagrange's Interpolation")

    r5 = solvers.lagrange_inverse_solver([2, 5, 8, 14], [94.8, 87.9, 81.3, 68.7], 85.0)
    assert abs(r5["x_eval"] - 6.29) < 0.5, f"M2 Lagrange Inverse Failed: {r5}"
    print("[PASS] 5. Lagrange's Inverse Interpolation")

    r6 = solvers.least_squares_fit_solver([1, 2, 3, 4, 5], [0.5, 2.5, 2.0, 4.0, 3.5], "linear")
    assert "equation_str" in r6, f"M2 Curve Fit Failed: {r6}"
    print("[PASS] 6. Least Squares Curve Fitting")

    # M3
    r7 = solvers.simpsons_13_solver("1 / (1 + x^2)", 0.0, 6.0, 6)
    assert abs(r7["integral"] - 1.366) < 0.1, f"M3 Simpsons Failed: {r7}"
    print("[PASS] 7. Simpson's 1/3 Rule")

    r8 = solvers.romberg_solver("1 / (1 + x)", 0.0, 1.0, 4)
    assert abs(r8["integral"] - 0.693147) < 1e-3, f"M3 Romberg Failed: {r8}"
    print("[PASS] 8. Romberg's Integration")

    r9 = solvers.gauss_quadrature_solver("x^2 + 2*x + 1", 0.0, 2.0, 3)
    assert abs(r9["integral"] - 8.6666) < 1e-2, f"M3 Gauss Quadrature Failed: {r9}"
    print("[PASS] 9. Gauss-Legendre Quadrature")

    # M4
    r10 = solvers.modified_euler_solver("x + y", 0.0, 1.0, 0.1, 0.5)
    assert abs(r10["final_y"] - 1.797) < 0.1, f"M4 Modified Euler Failed: {r10}"
    print("[PASS] 10. Modified Euler's Method")

    r11 = solvers.rk4_solver("x^2 + y^2", 0.0, 1.0, 0.1, 0.2)
    assert abs(r11["final_y"] - 1.273) < 0.05, f"M4 RK4 Failed: {r11}"
    print("[PASS] 11. 4th-Order Runge-Kutta")

    r12 = solvers.taylor_solver(0.0, 1.0, 0.1, {"y1": 1.0, "y2": 2.0, "y3": 3.0, "y4": 4.0})
    assert abs(r12["final_y"] - 1.1110) < 1e-2, f"M4 Taylor Failed: {r12}"
    print("[PASS] 12. Taylor's Series Method")

    # M5
    r13 = solvers.linear_bvp_solver("0", "x", "1", 0.0, 1.0, 0.0, 0.0, 0.25)
    assert len(r13["y_values"]) == 5, f"M5 Linear BVP Failed: {r13}"
    print("[PASS] 13. 2-Point Linear BVP")

    r14 = solvers.laplace_poisson_solver(6, 6, 100.0, 0.0, 75.0, 50.0, "0")
    assert r14["converged"] and len(r14["grid"]) == 6, f"M5 Laplace Poisson Failed: {r14}"
    print("[PASS] 14. 2D Laplace/Poisson Solver")

    r15 = solvers.crank_nicolson_solver(1.0, 0.2, 0.02, 5, 1.0, "sin(pi*x)", 0.0, 0.0)
    assert len(r15["time_levels"]) == 6, f"M5 Crank Nicolson Failed: {r15}"
    print("[PASS] 15. 1D Heat Equation (Crank-Nicolson)")

    print("\nALL 15 ALGORITHMS TESTED & VERIFIED SUCCESSFULLY!")

if __name__ == "__main__":
    test_all()
