// client/src/pages/index.tsx

import Head from 'next/head';
import { GetStaticProps, NextPage } from 'next';
import axios from 'axios';
import { IExperience } from '@/types';
import ExperienceCard from '@/components/home/ExperienceCard';
import { useSearch } from '@/context/SearchContext'; // <-- 1. IMPORT
import { useMemo } from 'react'; // <-- 2. IMPORT

// ... (keep HomeProps)
type HomeProps = {
  experiences: IExperience[];
};

// This is our page component
const Home: NextPage<HomeProps> = ({ experiences }) => {
  const { searchQuery } = useSearch(); // <-- 3. GET THE SEARCH QUERY

  // 4. Filter the experiences based on the search query
  const filteredExperiences = useMemo(() => {
    if (!searchQuery) {
      return experiences; // If search is empty, show all
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return experiences.filter((exp) =>
      exp.name.toLowerCase().includes(lowerCaseQuery) ||
      exp.locationTag.toLowerCase().includes(lowerCaseQuery) ||
      exp.description.toLowerCase().includes(lowerCaseQuery)
    );
  }, [searchQuery, experiences]);

  return (
    <>
      <Head>
        <title>BookIt - Travel Experiences</title>
        <meta name="description" content="Book your next adventure!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mt-5">
        <div className="row">
          {/* 5. Map over the filtered list */}
          {filteredExperiences.map((exp) => (
            <ExperienceCard key={exp._id} experience={exp} />
          ))}

          {/* Show a message if no results are found */}
          {filteredExperiences.length === 0 && (
            <div className="col-12 text-center">
              <h3 className="text-muted">No experiences found.</h3>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ... (keep getStaticProps - it is unchanged)
export const getStaticProps: GetStaticProps = async (context) => {
  try {
    // Call our backend API to get the experiences
    const res = await axios.get('http://localhost:5001/api/experiences');
    const experiences: IExperience[] = res.data;

    // This is the required return object
    return {
      props: {
        experiences, // This will be passed to the Home component as props
      },
      revalidate: 60, // Re-fetch data every 60 seconds (optional)
    };
  } catch (error) {
    console.error('Error fetching experiences:', error);
    
    // You must also return a props object on error
    return {
      props: {
        experiences: [], // Return an empty array on error
      },
    };
  }
};

export default Home;