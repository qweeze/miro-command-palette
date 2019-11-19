FROM python:3.7

COPY requirements.txt .
RUN pip install --upgrade pip -r requirements.txt

COPY . .
EXPOSE 443

ENTRYPOINT ["python", "server.py"]