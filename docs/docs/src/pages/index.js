import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import RoundGifContainer from '../components/OttoDisplay/OttoDisplay';

import Heading from '@theme/Heading';
import styles from './index.module.css';
import sampleGif from '../components/OttoDisplay/chatbot.gif';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="docs/introduction">
            Documentation
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Home`}
      description='Otto-m8 provides a flowchart-like UI to interconnect LLMs and Huggingface models, and deploy them as a REST API with little to no code.'>

      <main>
        <div className={styles.landingContainer}>
          <center>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <p className={styles.headerText}>Otto-m</p>
              <p className={styles.headerText2} >8</p>
            </div>
            <p className={styles.headerTagline}>{siteConfig.tagline}</p>
          </center>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "50px", marginBottom: "50px" }}>
            <RoundGifContainer gifSrc={sampleGif} altText="Round GIF" />
          </div>
          <div className={styles.starterButtons} style={{ display: "flex", justifyContent: "center", marginBottom: "50px" }}>
            <Link to="/docs/introduction"><button className={styles.getStartedButton}>Get Started</button></Link>
            <Link to="https://github.com/farhan0167/otto-m8/issues"><button className={styles.secondButton}>Feature Request/Feedback</button></Link>
          </div>
        </div>

        <div className={styles.featureContainer} style={{ marginTop: "120px", marginBottom: "50px" }}>
            <img className={styles.placeholderImages} src='./img/blocks.png' style={{ borderRadius:'20px', marginLeft:'5%'}}/>
            <div style={{marginLeft:'10%', marginRight:'5%', padding:'20px', alignContent: 'center'}}>
                <p className={`custom-font ${styles.featureTextHeader}`} style={{ fontWeight:'700'}}>Blocks</p>
                <p className='custom-font' style={{fontSize:'20px', fontWeight:'500'}}>Choose from a wide range of blocks to build your workflow.</p>
            </div>
        </div>

        <div className={styles.featureContainer} style={{ marginTop: "180px", marginBottom: "50px" }}>
            <div style={{marginLeft:'5%', padding:'50px', alignContent: 'center'}}>
                <p className={`custom-font ${styles.featureTextHeader}`} style={{ fontWeight:'700'}}>Configure</p>
                <p className='custom-font' style={{fontSize:'20px', fontWeight:'500'}}>Ready made configurations to get you started while minimizing clutter on the board.</p>
            </div>
            <img className={styles.placeholderImages} src='./img/blockconfig.png' style={{ borderRadius:'10px', marginRight:'2%'}}/>
        </div>

        <div className={styles.featureContainer} style={{ marginTop: "180px", marginBottom: "60px" }}>
            <img className={styles.placeholderImages} src='./img/code.png' style={{ borderRadius:'10px', marginLeft:'8%'}}/>
            <div style={{marginLeft:'5%', padding:'50px', alignContent: 'center'}}>
                <p className={`custom-font ${styles.featureTextHeader}`} style={{ fontWeight:'700'}}>Deploy</p>
                <p className='custom-font' style={{fontSize:'20px', fontWeight:'500'}}>Create your workflow and interact with it using:</p>
                <ul>
                  <li className={`custom-font ${styles.deployListText}`}>REST API</li>
                  <li className={`custom-font ${styles.deployListText}`}>Built in UI</li>
                  <li className={`custom-font ${styles.deployListText}`}>Docker Image for Cloud Deployment</li>
                </ul>
            </div>
        </div>
        
      </main>
    </Layout>
  );
}
