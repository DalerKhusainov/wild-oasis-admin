import { supabase, supabaseUrl } from "./supabae-client";
import type {
  CabinsType,
  CabinType,
  CreateCabinType,
} from "../types/CabinType";

export async function getCabins(): Promise<CabinsType> {
  const { data, error } = await supabase.from("cabins").select();

  if (error) {
    console.log(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

export async function createCabin(newCabin: CreateCabinType) {
  let hasImagePath;

  if (newCabin.image instanceof File) {
    hasImagePath = false;
  } else {
    hasImagePath = true;
  }

  const imageName = `${Math.random()}-${(newCabin.image as File).name}`.replace(
    "/",
    ""
  );

  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabins-images/${imageName}`;

  // 1) Create Cabin
  const { data, error } = await supabase
    .from("cabins")
    .insert([{ ...newCabin, image: imagePath }])
    .select();

  if (error || !data) {
    console.log(error);
    throw new Error("Cabin could not be created");
  }

  // 2) Upload image
  const { error: storageError } = await supabase.storage
    .from("cabins-images")
    .upload(imageName, newCabin.image);

  // 3) Delete the cabin IF there was an error uploading imgae
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data[0].id);
    console.error(storageError);
    throw new Error(
      "Cabin image could not be uploaded and the cabin was not created"
    );
  }

  return data;
}

export async function updateCabin(
  id: number,
  updatedCabin: Partial<CabinType>,
  newImage?: File | null
) {
  // Проверяем, был ли загружен новый файл изображения
  const hasNewImage = newImage instanceof File;

  let imagePath = updatedCabin.image; // По умолчанию используем существующий путь

  // Если загружено новое изображение, генерируем для него уникальное имя
  if (hasNewImage && newImage) {
    const imageName = `${Math.random()}-${newImage.name}`.replace("/", "");
    imagePath = `${supabaseUrl}/storage/v1/object/public/cabins-images/${imageName}`;
  }

  // 1. Обновляем данные домика в таблице "cabins"
  const updateData = {
    ...updatedCabin,
    image: imagePath, // Используем новый путь или оставляем старый
  };

  const { data, error } = await supabase
    .from("cabins")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error update a cabin: ", error);
    throw new Error("Could not update cabin data");
  }

  // 2. Если было загружено новое изображение, сохраняем его в хранилище
  if (hasNewImage && newImage) {
    const imageName = imagePath.split("/").pop()!; // Извлекаем имя файла из URL

    const { error: storageError } = await supabase.storage
      .from("cabins-images")
      .upload(imageName, newImage);

    if (storageError) {
      console.error("Error upload image: ", storageError);

      // При ошибке загрузки НЕ откатываем изменения в базе данных,
      // так как мы обновляем существующий домик, а не создаем новый.
      // Вместо этого выбрасываем ошибку с информацией о проблеме
      throw new Error(
        "The image has not been uploaded, but the house data has been updated. Please try uploading the image later."
      );
    }
  }

  return data;
}

export async function deleteCabin(id: number) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.log(error);
    throw new Error("Cabin could not be deleted");
  }

  return data;
}
