from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.orm import Session
from typing import cast

from app.core.seguridad import create_access_token, hash_password, verify_password
from app.database import get_db
from app.models.usuario import Usuario
from app.schemas.auth import RegistroUsuario, Token, UsuarioRead

router = APIRouter(prefix="/auth", tags=["Autenticación"])


@router.post("/register", response_model=UsuarioRead, status_code=201)
def registrar_usuario(datos: RegistroUsuario, db: Session = Depends(get_db)):
    if datos.rol not in {"admin", "consultor", "cliente"}:
        raise HTTPException(status_code=422, detail="Rol de usuario no válido.")
    if db.scalar(select(Usuario).where(Usuario.email == datos.email.lower())):
        raise HTTPException(status_code=409, detail="Ya existe un usuario con ese email.")

    usuario = Usuario(
        email=datos.email.lower(),
        nombre=datos.nombre,
        password_hash=hash_password(datos.password),
        rol=datos.rol,
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario


@router.post("/login", response_model=Token)
def iniciar_sesion(
    formulario: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    usuario = db.scalar(select(Usuario).where(Usuario.email == formulario.username.lower()))
    if usuario is None or not usuario.activo or not verify_password(
        formulario.password, cast(str, usuario.password_hash)
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"access_token": create_access_token(usuario), "token_type": "bearer"}
