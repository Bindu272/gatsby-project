import React from "react"
import setupTags from "../utils/setupTags"
import { Link } from "gatsby"
import slugify from "slugify"

const TagsList = ({ recipes }) => {
  const newTags = setupTags(recipes)
  return (
    <div className="tag-container">
      <h4 className="categories">categories</h4>
      <div className="tags-list">
        {newTags.map((tag, index) => {
          const [text, value] = tag
          const slug = slugify(text, { lower: true })

          return (
            <div >
            <Link to={`/tags/${slug}`} key={index} className="list">
              {text} ({value})
            </Link>
            </div>
           
          )
        })}
      </div>
    </div>
  )
}

export default TagsList
