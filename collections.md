---
layout: base
---



## Collections

Basically a list of disconnected items.

<ul class="post-list">
  {% for collection in site.collections %}
    <li class="post-list-item">
      <div class="right">
        <div class="post-title">
          <a href="{{ collection.url }}">{{ collection.title }}</a>
        </div>

        {% if collection.description %}
          <div>
          <p class="post-description">
            {{ collection.description }}
          </p>
        </div>
        {% endif %}
      </div>
    </li>
  {% endfor %}
</ul>

## Posts by field

{% assign post_by_field = site.posts | group_by:"field" %}

<ul class="post-by-field-list">
  {% for field in post_by_field %}
    <li class="post-list-item">
      <div class="left">
        <h3>
          {{ field.name }}
        </h3>
      </div>
      <div class="right">
        {% assign posts_sorted = field.items | sort: "title" %}
        {% for post in posts_sorted %}
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
        {% endfor %}
      </div>
    </li>
  {% endfor %}
</ul>
