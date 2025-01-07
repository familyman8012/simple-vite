import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import styled from '@emotion/styled';
import { Movie } from '@/types/movie';


const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #3498db;
  cursor: pointer;
  font-size: 1.1rem;
  margin-bottom: 24px;
  padding: 0;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Poster = styled.img`
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Info = styled.div`
  color: #2c3e50;
`;

const Title = styled.h1`
  margin: 0 0 16px 0;
  font-size: 2.5rem;
  color: #2c3e50;
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  color: #666;
`;

const Description = styled.p`
  line-height: 1.6;
  color: #34495e;
  margin-bottom: 24px;
`;

const GenreList = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 24px;
`;

const Genre = styled.span`
  background-color: #3498db;
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.9rem;
`;

interface MovieDetailResponse {
  status: string;
  data: {
    movie: Movie;
  };
}

export default function MovieDetail() {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery<MovieDetailResponse>({
    queryKey: ['movie', id],
    queryFn: async () => {
      const { data } = await axios.get(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`);
      console.log('API Response:', data);
      return data;
    },
  });

  const handleBack = () => {
    window.history.back();
  };

  if (isLoading) return <Container>🎬 영화 정보를 불러오는 중...</Container>;
  if (error) return <Container>⚠️ 영화 정보를 불러오는데 실패했습니다.</Container>;
  if (!data?.data.movie) return <Container>영화를 찾을 수 없습니다.</Container>;

  const movie = data.data.movie;

  return (
    <Container>
      <BackButton onClick={handleBack}>← 목록으로 돌아가기</BackButton>
      <Content>
        <Poster src={movie.large_cover_image} alt={movie.title} />
        <Info>
          <Title>{movie.title} ({movie.year})</Title>
          <MetaInfo>
            <span>⭐ {movie.rating}</span>
            <span>🎬 {movie.runtime}분</span>
            <span>🗣️ {movie.language}</span>
          </MetaInfo>
          <GenreList>
            {movie.genres.map((genre) => (
              <Genre key={genre}>#{genre}</Genre>
            ))}
          </GenreList>
          <Description>{movie.description_full}</Description>
        </Info>
      </Content>
    </Container>
  );
}
