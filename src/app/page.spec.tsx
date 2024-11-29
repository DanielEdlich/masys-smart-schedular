import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import LandingPage from '@/app/page'


describe('LandingPage', () => {

    it('renders LandingPage', () => {
        render(<LandingPage/>);
    });

    it('renders a heading', () => {
        render(LandingPage());
        const heading = screen.getByRole('heading', {level: 1});

        expect(heading).toBeInTheDocument();
    });
})
