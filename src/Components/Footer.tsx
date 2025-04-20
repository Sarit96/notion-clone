export default function Footer() {
    return (
      <footer className="h-14 border-t flex items-center justify-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Notion. All rights reserved.</p>
      </footer>
    )
  }
  