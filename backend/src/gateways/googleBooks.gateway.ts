import axios from 'axios';

interface BookSuggestion {
  id: string;
  title: string;
  authors: string[];
  thumbnail: string;
  publishedDate: string;
}

interface GoogleBookImageLinks {
  thumbnail?: string; 
  smallThumbnail?: string;
}

interface GoogleBookVolumeInfo {
  title: string;
  authors?: string[]; 
  publishedDate?: string;
  imageLinks?: GoogleBookImageLinks;
}

interface GoogleBookItem {
  id: string;
  volumeInfo: GoogleBookVolumeInfo;
}

interface GoogleBooksApiResponse {
  items?: GoogleBookItem[]; 
  totalItems: number;
}

/**
 * Busca livros na Google Books API por termo ou título + autor.
 * @param title
 * @param author
 * @returns
 */

export async function searchBookBySuggestion(
  title: string,
  author: string = ''
): Promise<BookSuggestion[]> {

  const query: string = `${title} ${author}`.trim();

  try {
    const response = await axios.get<GoogleBooksApiResponse>(
      'https://www.googleapis.com/books/v1/volumes',
      {
        params: {
          q: query,
          maxResults: 1
        }
      }
    );

    const books: GoogleBookItem[] = response.data.items || [];

    return books.map((item: GoogleBookItem): BookSuggestion => ({
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || [],
      thumbnail: item.volumeInfo.imageLinks?.thumbnail || '',
      publishedDate: item.volumeInfo.publishedDate || ''
    }));

  } catch (err: unknown) {
    
    if (err instanceof Error) {
      console.error('Erro ao buscar livro no Google Books:', err.message);
    } else if (axios.isAxiosError(err)) {
      console.error('Erro (Axios) ao buscar livro:', err.response?.data || err.message);
    } else {
      console.error('Erro desconhecido ao buscar livro:', err);
    }
    
    return [];
  }
}
