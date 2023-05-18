<div>
<span>Create/Add New Blog</span>{" "}
</div>
<label>Title: </label>
<br></br>
<input style={{ width: "100%" }} type="text" value={newBlogTitle} onChange={(event) => setNewBlogTitle(event.target.value)} />
<br />
<label>Content: </label> <br></br>
<textarea style={{ width: "100%", border: "1px solid #dee0e2", height: "auto", minHeight: "35vh" }} value={newBlogContent} onChange={(event) => setNewBlogContent(event.target.value)} />
<br />
<label>Author Name: </label> <br></br>
<input style={{ width: "100%" }} type="text" value={newBlogAuthorName} onChange={(event) => setNewBlogAuthorName(event.target.value)} />
<div>
<span> *Please Only Upload Valid Format </span>
<label htmlFor="newBlogImage">Image * .jpg, .png, .jpeg</label>
<input style={{ backgroundColor: "transparent", width: "100%" }} type="file" id="newBlogImage" name="newBlogImage" onChange={(event) => setNewBlogImage(event.target.files[0])} />
</div>
<br></br>
<button className="create" onClick={handleCreate}>
Create Blog
</button>