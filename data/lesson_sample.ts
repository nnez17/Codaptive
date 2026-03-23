import type { LessonData } from "./learn";

export const lessonsData: Record<string, LessonData> = {
  "lesson-1": {
    id: "lesson-1",
    title: "Print & String",
    level: "beginner",
    sections: [
      {
        type: "explanation",
        content:
          "print() digunakan untuk menampilkan output di layar. String adalah teks yang ditulis menggunakan tanda kutip.",
        example: 'print("Hello")',
      },
      {
        type: "quiz",
        questions: [
          {
            id: "q1",
            type: "mcq",
            question: "Apa output dari code berikut?",
            code: 'print("Hello")',
            options: ["hello", "Hello", '"Hello"', "error"],
            answer: "Hello",
            correctFeedback: "print() menampilkan isi string apa adanya.",
            wrongFeedback:
              "Python bersifat case-sensitive (huruf besar kecil berbeda).",
          },
          {
            id: "q2",
            type: "fill",
            instruction: "Gabungkan string",
            code: 'print("Hello" __ "World")',
            options: ["+", "*", "-", "/"],
            answer: "+",
            expectedOutput: "HelloWorld",
            correctFeedback: "Operator + digunakan untuk menggabungkan string.",
            wrongFeedback:
              "Operator lain tidak digunakan untuk menggabungkan string.",
          },
          {
            id: "q3",
            type: "mcq",
            question: "Apa output dari code berikut?",
            code: 'print("A" * 2)',
            options: ["A2", "AA", "error", "A A"],
            answer: "AA",
            correctFeedback: "Operator * mengulang string.",
            wrongFeedback:
              "Perkalian pada string berarti pengulangan, bukan penjumlahan.",
          },
          {
            id: "q4",
            type: "fill",
            instruction: "Tampilkan dua teks",
            code: "print(__ , __)",
            options: ['"Hi"', '"Python"', "5", "x"],
            answer: ['"Hi"', '"Python"'],
            expectedOutput: "Hi Python",
            correctFeedback:
              "Koma pada print() akan memberi spasi antar output.",
            wrongFeedback: "Gunakan dua string dan pisahkan dengan koma.",
          },
        ],
      },
      {
        type: "explanation",
        content:
          "String bisa diakses menggunakan index. Index dimulai dari 0. String juga memiliki method seperti upper().",
        example: '"abc"[0]  # a\n"abc".upper()  # ABC',
      },
      {
        type: "quiz",
        questions: [
          {
            id: "q5",
            type: "fill",
            instruction: "Ambil huruf pertama",
            code: 'print("abc"[__])',
            options: ["0", "1", "2", "-1"],
            answer: "0",
            expectedOutput: "a",
            correctFeedback: "Index pertama dimulai dari 0.",
            wrongFeedback: "Python menggunakan index mulai dari 0.",
          },
          {
            id: "q6",
            type: "mcq",
            question: "What does this code do?",
            code: 'len("abc")',
            options: [
              "Mengubah huruf",
              "Menghitung panjang string",
              "Menghapus string",
              "Mengulang string",
            ],
            answer: "Menghitung panjang string",
            correctFeedback: "len() menghitung jumlah karakter dalam string.",
            wrongFeedback:
              "Fungsi ini hanya menghitung panjang, bukan mengubah data.",
          },
          {
            id: "q7",
            type: "fill",
            instruction: "Ubah menjadi huruf besar",
            code: 'print("abc".__())',
            options: ["upper", "lower", "len", "int"],
            answer: "upper",
            expectedOutput: "ABC",
            correctFeedback: "upper() mengubah semua huruf menjadi kapital.",
            wrongFeedback: "Gunakan method yang tepat untuk mengubah huruf.",
          },
          {
            id: "q8",
            type: "mcq",
            question: "Apa output dari code berikut?",
            code: 'print("abc".upper())',
            options: ["abc", "ABC", "Abc", "error"],
            answer: "ABC",
            correctFeedback: "Semua huruf diubah menjadi besar.",
            wrongFeedback:
              "upper() hanya mengubah huruf, bukan struktur string.",
          },
        ],
      },
    ],
  },
};
