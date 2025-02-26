FROM farhan0167/otto-m8-base:latest

WORKDIR /app

EXPOSE 8000

# Start the FastAPI server using Uvicorn
RUN echo "Starting FastAPI server..."
CMD ["poetry", "run", "uvicorn", "client:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]