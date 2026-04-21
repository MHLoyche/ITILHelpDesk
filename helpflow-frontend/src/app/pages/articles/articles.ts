import { Component, OnInit, signal } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { ArticleService } from "../../services/articles";

@Component({
  selector: "app-articles",
  imports: [RouterLink, RouterLinkActive],
  templateUrl: "./articles.html",
  styleUrl: "./articles.css",
})
export class Articles implements OnInit{
  articles = signal<any[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  
  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.articleService.getArticles().subscribe({
      next: (data) => {
        this.articles.set(data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set("Failed to load articles");
        this.loading.set(false);
      },
    });
  }
}
