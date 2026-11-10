# A "shipping box" that holds the guard and everything it needs
# ▶ PART 1: Start from a small ready-made computer that already has Python
FROM python:3.12-slim

# ▶ PART 2: Make a normal user, not an all-powerful one
# Run as a normal user (free hosting sites like Hugging Face Spaces require this)
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user PATH=/home/user/.local/bin:$PATH
WORKDIR $HOME/app

# ▶ PART 3: Install only the small tool list (no PyTorch needed to RUN the guard)
COPY --chown=user requirements-serve.txt .
RUN pip install --no-cache-dir -r requirements-serve.txt

# ▶ PART 4: Copy in the guard: the code, the packed brain, and the ruler numbers
COPY --chown=user serve.py nids_mini.onnx ./
COPY --chown=user data/meta.json ./data/meta.json

# ▶ PART 5: Open door 7860 and start the web server
EXPOSE 7860
CMD ["uvicorn", "serve:app", "--host", "0.0.0.0", "--port", "7860"]
