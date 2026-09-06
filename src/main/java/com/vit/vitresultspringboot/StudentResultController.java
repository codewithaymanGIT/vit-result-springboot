package com.vit.vitresultspringboot;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "*")
public class StudentResultController {

    @Autowired
    private StudentResultRepository repository;

    @PostMapping
    public StudentResult calculateAndSave(@RequestBody StudentResult input) {
        double weighted1 = ((input.getMse1() / 50) * 30) + ((input.getEse1() / 100) * 70);
        double weighted2 = ((input.getMse2() / 50) * 30) + ((input.getEse2() / 100) * 70);
        double weighted3 = ((input.getMse3() / 50) * 30) + ((input.getEse3() / 100) * 70);
        double weighted4 = ((input.getMse4() / 50) * 30) + ((input.getEse4() / 100) * 70);

        double totalWeighted = weighted1 + weighted2 + weighted3 + weighted4;
        double percentage = (totalWeighted / 400) * 100;
        String grade = calculateGrade(percentage);

        input.setTotalWeighted(totalWeighted);
        input.setPercentage(percentage);
        input.setGrade(grade);

        return repository.save(input);
    }

    @GetMapping
    public List<StudentResult> getAllResults() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public StudentResult getResultById(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deleteResult(@PathVariable Long id) {
        repository.deleteById(id);
    }

    private String calculateGrade(double percentage) {
        if (percentage >= 90) return "S";
        if (percentage >= 80) return "A";
        if (percentage >= 70) return "B";
        if (percentage >= 60) return "C";
        if (percentage >= 50) return "D";
        if (percentage >= 40) return "E";
        return "F";
    }
}