-- Estas políticas deben ejecutarse en la consola SQL de tu proyecto de Supabase.
-- Por defecto la autenticación funciona sin esto, pero si creas tablas (ej. profiles) esta es una política recomendada.

-- Supongamos que creamos una tabla 'profiles':
/*
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  username text,
  full_name text,
  avatar_url text,
  school_location text
);
*/

-- Habilitar Row Level Security (RLS) en la tabla
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Crear una política para que cada usuario solo vea sus propios datos (o si es público, que todos vean)
/*
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING ( true );
*/

-- Crear política para que solo el propietario (user) pueda actualizar su registro
/*
CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE
  USING ( auth.uid() = id );
*/
