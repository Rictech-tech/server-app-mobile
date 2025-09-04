# DEV
```pnpm start```

# ADD USER
````
curl -X POST "https://srhpcnaonhyzwvirvczi.supabase.co/auth/v1/admin/users" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyaHBjbmFvbmh5end2aXJ2Y3ppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njg2Nzc4NSwiZXhwIjoyMDcyNDQzNzg1fQ.qYVh94hfn-eWPrsPlEBFkueJWwVOlzJZDxHnVZSVHNM" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyaHBjbmFvbmh5end2aXJ2Y3ppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njg2Nzc4NSwiZXhwIjoyMDcyNDQzNzg1fQ.qYVh94hfn-eWPrsPlEBFkueJWwVOlzJZDxHnVZSVHNM" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "franky.cunza@gmail.com",
    "password": "123456",
    "email_confirm": true,
    "user_metadata": {
      "document_number": "12345678",
      "role": "user",
      "first_name": "Franky",
      "second_name": "",
      "paternal_surname": "Cunza",
      "maternal_surname": "Chavez",
      "last_name": "Espinoza",
      "position": "ANALISTA DE CREDITOS V",
      "agency": {
        "code": "03",
        "name": "Huancayo"
      },
      "is_active": true
    }
  }'
````