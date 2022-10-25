import React from "react"
import Layout from "../components/Layout"
import Recipelist from "../components/Recipelist"
import { graphql } from "gatsby"
import SEO from "../components/SEO"
const Contact = () => {
 
  return (
    <Layout>
    <SEO title="Contact"/>
      <main className="page">
        <section className="contact-page">
          <article className="contact-info">
            <h3>Want To get in touch?</h3>
            <p>
              Sit eiusmod laborum incididunt mollit laboris irure reprehenderit
              nisi aute.
            </p>
            <p>
              Ut et pariatur Lorem velit ad cupidatat enim id ea. Magna esse
              elit nostrud et dolore proident.
            </p>
            <p>
              Amet pariatur culpa aliquip dolore. Nostrud laborum excepteur
              veniam tempor proident fugiat quis.
            </p>
          </article>
          <article>
            <form
              className="form contact-form"
              action="https://formspree.io/f/myyvjzak"
              method="POST"
            >
              <div className="form-row">
                <label htmlFor="name">Your name</label>
                <input type="text" name="name" id="name" />
              </div>
              <div className="form-row">
                <label htmlFor="name">Your email</label>
                <input type="text" name="email" id="email" />
              </div>
              <div className="form-row">
                <label htmlFor="message">message</label>
                <textarea name="message" id="message"></textarea>
              </div>
              <button type="submit" className="btn block">
                submit
              </button>
            </form>
          </article>
        </section>
      
      </main>
    </Layout>
  )
}


export default Contact
