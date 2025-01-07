import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MovieListResponse } from '../types/movie';
import MovieCard from '../components/MovieCard';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const Header = styled.header`
  margin-bottom: 32px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 16px;
  color: #2c3e50;
`;

const SubTitle = styled.p`
  text-align: center;
  color: #666;
  margin-top: -8px;
  margin-bottom: 32px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
`;

const LoadingText = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  padding: 48px;
`;

const ErrorText = styled.div`
  text-align: center;
  color: #e74c3c;
  padding: 48px;
`;

export default function Home() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery<MovieListResponse>({
    queryKey: ['movies'],
    queryFn: async () => {
      // 최신 영화 중에서 평점 6점 이상인 영화들을 30개까지 표시
      const { data } = await axios.get(
        'https://yts.mx/api/v2/list_movies.json?sort_by=year&order_by=desc&limit=30&minimum_rating=8'
      );
      return data;
    },
  });

  if (isLoading) return <LoadingText>🎬 최신 영화 정보를 불러오는 중...</LoadingText>;
  if (error) return <ErrorText>⚠️ 영화 정보를 불러오는데 실패했습니다.</ErrorText>;

  return (
    <Container>
      <Header>
        <Title>🎥 최신 인기 영화</Title>
        <SubTitle>평점 6점 이상의 최신 영화들을 만나보세요!</SubTitle>
      </Header>
      <Grid>
        {data?.data.movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={() => navigate(`/movie/${movie.id}`)}
          />
        ))}
      </Grid>
    </Container>
  );
}