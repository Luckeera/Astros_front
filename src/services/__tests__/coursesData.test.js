import { describe, it, expect } from 'vitest';
import { UNIFIED_AREAS, MASTER_COURSES, detectAreaForCourse } from '../coursesData';

describe('Catálogo Unificado de Cursos e Áreas (coursesData)', () => {
  it('deve conter as 9 áreas oficiais unificadas', () => {
    expect(UNIFIED_AREAS).toContain('Tecnologia');
    expect(UNIFIED_AREAS).toContain('Engenharia');
    expect(UNIFIED_AREAS).toContain('Saúde');
    expect(UNIFIED_AREAS).toContain('Direito');
    expect(UNIFIED_AREAS).toContain('Negócios');
    expect(UNIFIED_AREAS).toContain('Design');
    expect(UNIFIED_AREAS).toContain('Comunicação');
    expect(UNIFIED_AREAS).toContain('Humanidades & Educação');
    expect(UNIFIED_AREAS).toContain('Ciências Agrárias & Ambientais');
  });

  it('deve possuir um catálogo extenso de cursos pré-mapeados', () => {
    expect(MASTER_COURSES.length).toBeGreaterThan(50);
    const software = MASTER_COURSES.find(c => c.name === 'Engenharia de Software');
    expect(software?.area).toBe('Tecnologia');

    const med = MASTER_COURSES.find(c => c.name === 'Medicina');
    expect(med?.area).toBe('Saúde');

    const direito = MASTER_COURSES.find(c => c.name === 'Direito');
    expect(direito?.area).toBe('Direito');
  });

  it('deve inferir a área corretamente a partir do nome ou apelido do curso', () => {
    expect(detectAreaForCourse('Ciência da Computação')).toBe('Tecnologia');
    expect(detectAreaForCourse('ADS')).toBe('Tecnologia');
    expect(detectAreaForCourse('Enfermagem')).toBe('Saúde');
    expect(detectAreaForCourse('Psicologia')).toBe('Saúde');
    expect(detectAreaForCourse('Administração')).toBe('Negócios');
    expect(detectAreaForCourse('Publicidade e Propaganda')).toBe('Comunicação');
    expect(detectAreaForCourse('Jornalismo')).toBe('Comunicação');
    expect(detectAreaForCourse('Engenharia Mecânica')).toBe('Engenharia');
    expect(detectAreaForCourse('Design Gráfico')).toBe('Design');
    expect(detectAreaForCourse('Pedagogia')).toBe('Humanidades & Educação');
    expect(detectAreaForCourse('Agronomia')).toBe('Ciências Agrárias & Ambientais');
  });
});
