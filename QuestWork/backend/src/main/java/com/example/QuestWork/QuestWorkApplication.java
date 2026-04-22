package com.example.QuestWork;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SpringBootApplication
@EnableJpaAuditing
public class QuestWorkApplication {
	public static void main(String[] args) {
		SpringApplication.run(QuestWorkApplication.class, args);
	}

	@GetMapping(value="/")
	public String HelloWorld() {
		return "Hello World";
	}
}
