import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//save filename to local storage
export function saveFilenameToLocalStorage(filename: string) {
  localStorage.setItem("filename", filename)
}

//get filename from local storage
export function getFilenameFromLocalStorage() {
  return localStorage.getItem("filename")
}

