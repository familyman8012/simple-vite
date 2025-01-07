import styled from '@emotion/styled';
import { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

const Card = styled.div`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  cursor: pointer;
  background: white;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 16px;
`;

const Title = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1.2rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Info = styled.div`
  display: flex;
  gap: 12px;
  color: #666;
  font-size: 0.9rem;
`;

const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  return (
    <Card onClick={onClick}>
      <Image src={movie.medium_cover_image} alt={movie.title} />
      <Content>
        <Title>{movie.title} ({movie.year})</Title>
        <Info>
          <span>⭐ {movie.rating}</span>
          <span>🎬 {movie.runtime}분</span>
        </Info>
      </Content>
    </Card>
  );
};

export default MovieCard;
