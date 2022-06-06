---
layout: base
---

<ul class="post-list">
  {% for post in site.posts %}
    <li class="post-list-item">
      <div class="left">
        <div class="post-date sans">
          {{ post.date | date: "%Y-%m-%d" }}
        </div>
      </div>
      <div class="right">
        <div class="post-title">
          <a href="{{ post.url }}">{{ post.title }}</a>
        </div>

        {% if post.description %}
          <div>
          <p class="post-description">
            {{ post.description }}
          </p>
        </div>
        {% endif %}

        <ul class="tag-list sans">
          {% for tag in post.tags %}
          <li class="tag-list-item">
            {{ tag }}
          </li>
          {% endfor %}
        </ul>
      </div>
    </li>
  {% endfor %}
</ul>
