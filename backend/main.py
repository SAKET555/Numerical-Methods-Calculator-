from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

import solvers

app = FastAPI(
    title="NumCore Studio API",
    description="High-Precision Numerical Computation Backend",
    version="1.0.0"
)

# Enable CORS for Vite frontend on port 5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "NumCore Studio API is operational."}

# ---------------------------------------------------------
# MODULE 1 MODELS & ENDPOINTS
# ---------------------------------------------------------

class FixedPointRequest(BaseModel):
    g_expr: str = Field(..., example="cos(x)")
    x0: float = Field(..., example=0.5)
    tol: float = Field(1e-6, example=1e-6)
    max_iter: int = Field(50, example=50)

@app.post("/api/m1/fixed-point")
def api_fixed_point(req: FixedPointRequest):
    try:
        return solvers.fixed_point_solver(req.g_expr, req.x0, req.tol, req.max_iter)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class SecantRequest(BaseModel):
    f_expr: str = Field(..., example="x^3 - x - 2")
    x0: float = Field(..., example=1.0)
    x1: float = Field(..., example=2.0)
    tol: float = Field(1e-6, example=1e-6)
    max_iter: int = Field(50, example=50)

@app.post("/api/m1/secant")
def api_secant(req: SecantRequest):
    try:
        return solvers.secant_solver(req.f_expr, req.x0, req.x1, req.tol, req.max_iter)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class GaussSeidelRequest(BaseModel):
    A: List[List[float]] = Field(..., example=[[10, -1, 2], [-1, 11, -1], [2, -1, 10]])
    B: List[float] = Field(..., example=[6, 25, -11])
    x0: List[float] = Field(..., example=[0, 0, 0])
    tol: float = Field(1e-6, example=1e-6)
    max_iter: int = Field(50, example=50)

@app.post("/api/m1/gauss-seidel")
def api_gauss_seidel(req: GaussSeidelRequest):
    try:
        return solvers.gauss_seidel_solver(req.A, req.B, req.x0, req.tol, req.max_iter)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ---------------------------------------------------------
# MODULE 2 MODELS & ENDPOINTS
# ---------------------------------------------------------

class LagrangeInterpRequest(BaseModel):
    x_points: List[float] = Field(..., example=[5, 6, 9, 11])
    y_points: List[float] = Field(..., example=[12, 13, 14, 16])
    x_eval: float = Field(..., example=10.0)

@app.post("/api/m2/lagrange-interp")
def api_lagrange_interp(req: LagrangeInterpRequest):
    try:
        return solvers.lagrange_interp_solver(req.x_points, req.y_points, req.x_eval)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class LagrangeInverseRequest(BaseModel):
    x_points: List[float] = Field(..., example=[2, 5, 8, 14])
    y_points: List[float] = Field(..., example=[94.8, 87.9, 81.3, 68.7])
    y_eval: float = Field(..., example=85.0)

@app.post("/api/m2/lagrange-inverse")
def api_lagrange_inverse(req: LagrangeInverseRequest):
    try:
        return solvers.lagrange_inverse_solver(req.x_points, req.y_points, req.y_eval)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class CurveFitRequest(BaseModel):
    x_points: List[float] = Field(..., example=[1, 2, 3, 4, 5])
    y_points: List[float] = Field(..., example=[0.5, 2.5, 2.0, 4.0, 3.5])
    model_type: str = Field("linear", example="linear") # "linear", "exponential", "parabolic"

@app.post("/api/m2/curve-fit")
def api_curve_fit(req: CurveFitRequest):
    try:
        return solvers.least_squares_fit_solver(req.x_points, req.y_points, req.model_type)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ---------------------------------------------------------
# MODULE 3 MODELS & ENDPOINTS
# ---------------------------------------------------------

class SimpsonsRequest(BaseModel):
    f_expr: str = Field(..., example="1 / (1 + x^2)")
    a: float = Field(0.0, example=0.0)
    b: float = Field(6.0, example=6.0)
    n: int = Field(6, example=6)

@app.post("/api/m3/simpsons")
def api_simpsons(req: SimpsonsRequest):
    try:
        return solvers.simpsons_13_solver(req.f_expr, req.a, req.b, req.n)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class RombergRequest(BaseModel):
    f_expr: str = Field(..., example="1 / (1 + x)")
    a: float = Field(0.0, example=0.0)
    b: float = Field(1.0, example=1.0)
    k: int = Field(4, example=4)

@app.post("/api/m3/romberg")
def api_romberg(req: RombergRequest):
    try:
        return solvers.romberg_solver(req.f_expr, req.a, req.b, req.k)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class GaussQuadratureRequest(BaseModel):
    f_expr: str = Field(..., example="x^2 + 2*x + 1")
    a: float = Field(0.0, example=0.0)
    b: float = Field(2.0, example=2.0)
    n_points: int = Field(2, example=2) # 2 or 3

@app.post("/api/m3/gauss-quadrature")
def api_gauss_quadrature(req: GaussQuadratureRequest):
    try:
        return solvers.gauss_quadrature_solver(req.f_expr, req.a, req.b, req.n_points)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ---------------------------------------------------------
# MODULE 4 MODELS & ENDPOINTS
# ---------------------------------------------------------

class ModifiedEulerRequest(BaseModel):
    f_expr: str = Field(..., example="x + y")
    x0: float = Field(0.0, example=0.0)
    y0: float = Field(1.0, example=1.0)
    h: float = Field(0.1, example=0.1)
    x_end: float = Field(0.5, example=0.5)

@app.post("/api/m4/modified-euler")
def api_modified_euler(req: ModifiedEulerRequest):
    try:
        return solvers.modified_euler_solver(req.f_expr, req.x0, req.y0, req.h, req.x_end)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class RK4Request(BaseModel):
    f_expr: str = Field(..., example="x^2 + y^2")
    x0: float = Field(0.0, example=0.0)
    y0: float = Field(1.0, example=1.0)
    h: float = Field(0.1, example=0.1)
    x_end: float = Field(0.2, example=0.2)

@app.post("/api/m4/rk4")
def api_rk4(req: RK4Request):
    try:
        return solvers.rk4_solver(req.f_expr, req.x0, req.y0, req.h, req.x_end)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class TaylorRequest(BaseModel):
    x0: float = Field(0.0, example=0.0)
    y0: float = Field(1.0, example=1.0)
    x_eval: float = Field(0.1, example=0.1)
    derivatives: Dict[str, float] = Field(
        default_factory=lambda: {"y1": 1.0, "y2": 2.0, "y3": 3.0, "y4": 4.0},
        example={"y1": 1.0, "y2": 2.0, "y3": 3.0, "y4": 4.0}
    )

@app.post("/api/m4/taylor")
def api_taylor(req: TaylorRequest):
    try:
        return solvers.taylor_solver(req.x0, req.y0, req.x_eval, req.derivatives)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ---------------------------------------------------------
# MODULE 5 MODELS & ENDPOINTS
# ---------------------------------------------------------

class LinearBVPRequest(BaseModel):
    P_expr: str = Field("0", example="0")
    Q_expr: str = Field("x", example="x")
    R_expr: str = Field("1", example="1")
    a: float = Field(0.0, example=0.0)
    b: float = Field(1.0, example=1.0)
    alpha: float = Field(0.0, example=0.0)
    beta: float = Field(0.0, example=0.0)
    h: float = Field(0.25, example=0.25)

@app.post("/api/m5/linear-bvp")
def api_linear_bvp(req: LinearBVPRequest):
    try:
        return solvers.linear_bvp_solver(req.P_expr, req.Q_expr, req.R_expr, req.a, req.b, req.alpha, req.beta, req.h)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class LaplacePoissonRequest(BaseModel):
    Nx: int = Field(5, example=5)
    Ny: int = Field(5, example=5)
    top: float = Field(100.0, example=100.0)
    bottom: float = Field(0.0, example=0.0)
    left: float = Field(75.0, example=75.0)
    right: float = Field(50.0, example=50.0)
    g_expr: str = Field("0", example="0")

@app.post("/api/m5/laplace-poisson")
def api_laplace_poisson(req: LaplacePoissonRequest):
    try:
        return solvers.laplace_poisson_solver(req.Nx, req.Ny, req.top, req.bottom, req.left, req.right, req.g_expr)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class CrankNicolsonRequest(BaseModel):
    alpha: float = Field(1.0, example=1.0)
    dx: float = Field(0.2, example=0.2)
    dt: float = Field(0.02, example=0.02)
    t_steps: int = Field(5, example=5)
    L: float = Field(1.0, example=1.0)
    u_ic_str: str = Field("sin(pi*x)", example="sin(pi*x)")
    u_left: float = Field(0.0, example=0.0)
    u_right: float = Field(0.0, example=0.0)

@app.post("/api/m5/crank-nicolson")
def api_crank_nicolson(req: CrankNicolsonRequest):
    try:
        return solvers.crank_nicolson_solver(
            req.alpha, req.dx, req.dt, req.t_steps, req.L, req.u_ic_str, req.u_left, req.u_right
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
